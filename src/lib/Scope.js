import moment from 'moment'

export default class Scope {

    constructor() {
        this.startTime = undefined
        this.stopTime = undefined
        this.serviceScopes = []
    }

    parse(element) {
        if (element.hasAttribute("startTime")) {
            try {
                startTime = moment(element.getAttribute("startTime"))
                this.startTime = startTime
            } catch(err) {
                console.warn("Scope has invalid start time")
            }
        }
        if (element.hasAttribute("stopTime")) {
            try {
                stopTime = moment(element.getAttribute("stopTime"))
                this.stopTime = stopTime
            } catch(err) {
                console.warn("Scope has invalid stop time")
            }
        }
        var childNodes = element.childNodes
        for (var i=0; i < childNodes.length; i++) {
            const child = childNodes[i]
            if (child.nodeName === "serviceScope") {
                this.parseServiceScope(child)
            }
        }
    }

    parseServiceScope(element) {
        if (element.hasAttribute("id")) {
            this.serviceScopes.push(element.getAttribute("id"))
        } else {
            console.warm("Service scope without an ID")
        }
    }
}
