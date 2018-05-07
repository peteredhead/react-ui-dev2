import Service from './Service'
import ServiceGroup from './ServiceGroup'

export default class SI {

    constructor() {
        this.serviceProvider = null
        this.services = {}
        this.serviceGroups = {}
        this.nonGroupServices = []
        this.creationTime = undefined
    }

    getAllServices() {
        let services = []
        for (var i = 0; i < this.services.length; i++) {
            services.push(this.services[i])
        }
        return services
    }

    getAllNonGroupServices() {
        let services = []
        for (var i = 0; i < this.nonGroupServices.length; i++) {
            const serviceId = this.nonGroupServices[i]
            services.push(this.services[serviceId])
        }
        return services
    }

    getServicesByGroup(groupId) {
        let services = []
        if (groupId in this.serviceGroups) {
            const serviceIds = this.serviceGroups[groupId].serviceIds
            for (var i = 0; i < serviceIds.length; i++) {
                services.push(this.services[serviceIds[i]])
            }
        }
        return services
    }

    getServiceGroups() {
        return this.serviceGroups
    }

    parseServices(xml) {
        const services = xml.getElementsByTagName('service')
        for (var i = 0; i < services.length; i++) {
            let service = new Service()
            try {
                service.parse(services[i])
                this.services[i] = service
                if (service.serviceGroupMember !== undefined) {
                    this.addServiceToGroup(service.serviceGroupMember, i)
                } else {
                    this.nonGroupServices.push(i)
                }
            } catch(err) {
                console.log("Things went bad whilst parsing service from XSI")
                console.error(err.message)
                console.log(err.stack)
            }
        }
    }

    parseServiceGroups(xml) {
        const serviceGroups = xml.getElementsByTagName('serviceGroup')
        for (var i = 0; i < serviceGroups.length; i++) {
            let serviceGroup = new ServiceGroup()
            try {
                serviceGroup.parse(serviceGroups[i])
                if (serviceGroup.id !== undefined) {
                    this.serviceGroups[serviceGroup.id] = serviceGroup
                }
            } catch(err) {
                console.log("Things went bad whilst parsing service groups from XSI")
                console.error(err.message)
                console.log(err.stack)
            }
        }
    }

    parse(xml) {
        this.parseServiceGroups(xml)
        this.parseServices(xml)
    }

    addServiceToGroup(groupId, serviceId) {
        if (groupId in this.serviceGroups) {
            this.serviceGroups[groupId].linkServiceId(serviceId)
        }
    }
}
