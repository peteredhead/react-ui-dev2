import Genre from "./Genre"
import Link from "./Link"
import Multimedia from "./Multimedia"

export default class ServiceGroup {
    constructor() {
        this.id = undefined
        this.genres = []
        this.keywords = []
        this.links = []
        this.shortName = undefined
        this.mediumName = undefined
        this.longName = undefined
        this.multimedia = [] // may want to key this
        this.shortDescription = undefined
        this.longDescription = undefined
        this.serviceIds = []
    }

    parse(element) {
        if (element.hasAttribute("id")) {
            this.id = element.getAttribute("id")
        }
        var childNodes = element.childNodes
        for (var i=0; i < childNodes.length; i++) {
            const child = childNodes[i]
            var nodeName = child.nodeName
            switch (nodeName) {
                case "shortName":
                    this.shortName = this.parseText(child, 8)
                    break
                case "mediumName":
                    this.mediumName = this.parseText(child, 16)
                    break
                case "longName":
                    this.longName = this.parseText(child, 128)
                    break
                case "mediaDescription":
                    this.parseMediaDescription(child)
                    break
                case "link":
                    this.parseLink(child)
                    break
                case "genre":
                    this.parseGenre(child)
                    break
                case "keywords":
                    this.parseKeywords(child)
                    break
                default:
                    // Unknown element type
            }
        }
    }

    parseText(element, maxLength) {
      if (element.childNodes !== undefined && element.childNodes.length > 0) {
          let text = element.childNodes[0].textContent
          // Check length
          if (text.length > maxLength) {
              console.warn(`${element.nodeName} exceeds the maximum length of ${maxLength} characters`)
              return undefined
          } else {
              return text
          }
      }
      return undefined
    }

    parseLink(element) {
        let link = new Link(
            element.hasAttribute("uri") ? element.getAttribute("uri") : undefined,
            element.hasAttribute("mimeValue") ? element.getAttribute("mimeValue") : undefined,
            element.hasAttribute("lang") ? element.getAttribute("lang") : undefined,
            element.hasAttribute("description") ? element.getAttribute("description") : undefined,
            element.hasAttribute("expiryTime") ? element.getAttribute("expiryTime") : undefined
        )
        if (!link.expired) this.links.push(link)
    }

    parseMediaDescription(element) {
        var childNodes = element.childNodes
        for (var i=0; i < childNodes.length; i++) {
            const child = childNodes[i]
            var nodeName = child.nodeName
            switch (nodeName) {
                case "shortDescription":
                    this.shortDescription = this.parseText(child, 180)
                    break
                case "longDescription":
                    this.longDescription = this.parseText(child, 1200)
                    break
                case "multimedia":
                    this.parseMultimedia(child)
                    break
                default:
                    // Unknown mediaDescription type
            }
        }
    }

    parseMultimedia(element) {
        let width = parseInt(element.getAttribute("width"), 10)
        if (isNaN(width)) { width = undefined }
        let height = parseInt(element.getAttribute("height"), 10)
        if (isNaN(height)) { height = undefined }
        let multimedia = new Multimedia(
            element.hasAttribute("url") ? element.getAttribute("url") : undefined,
            element.hasAttribute("lang") ? element.getAttribute("lang") : undefined,
            element.hasAttribute("mimeValue") ? element.getAttribute("mimeValue") : undefined,
            element.hasAttribute("type") ? element.getAttribute("type") : undefined,
            width,
            height
        )
        this.multimedia.push(multimedia)
    }

    parseGenre(element) {
        let genre = new Genre(
            element.hasAttribute("href") ? element.getAttribute("href") : undefined,
            element.hasAttribute("href") ? element.getAttribute("type") : undefined,
            element.textContent
        )
        this.genres.push(genre)
    }
    parseKeywords(element) {
        let keywords = element.childNodes[0].textContent.split(",")
        // Remove spaces from keywords
        this.keywords = keywords.map((keyword) => { return keyword.trim()})
    }

    linkServiceId(id) {
        this.serviceIds.push(id)
    }

    getName() {
        // Return whichever of shortName, mediumName, longName
        if (this.longName !== undefined) {
            return this.longName
        } else if (this.mediumName !== undefined) {
            return this.mediumName
        } else {
            return this.shortName
        }
    }

    getDescription() {
        if (this.longDescription !== undefined) {
            return this.longDescription
        } else {
            return this.shortDescription
        }
    }

    getServiceIds() {
        return this.serviceIds
    }
}
