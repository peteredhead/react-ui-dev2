import chai from 'chai'
import path from 'path'
import {DOMParser} from 'xmldom'
import moment from 'moment'

var expect = chai.expect
chai.should()

import ServiceGroup from "../lib/ServiceGroup"
import {GENRE_TYPE} from "../lib/Genre"

import serviceGroupXml from "./assets/serviceGroupXml"

var parser = new DOMParser()
const data = parser.parseFromString(serviceGroupXml(), "text/xml");

var serviceGroup = new ServiceGroup()
serviceGroup.parse(data.childNodes[0])

describe("ServiceGroup element parser", () => {

    it("exists", () => {
        ServiceGroup.should.exist
    }),

    describe("genres", () => {
       it("has the correct number of genres", () => {
           serviceGroup.genres.length.should.equal(3)
       }),
       it("parses the genres correctly", () => {
           const genre = serviceGroup.genres[1]
           genre.href.should.equal("urn:tva:metadata:cs:ContentCS:2004:3.6.10")

       }),
       it("assumes a genre with no type specified is the main genre", () =>{
           const genre = serviceGroup.genres[0]
           genre.type_.should.equal(GENRE_TYPE.MAIN)
       }),
       it("parses the secondary genre type correctly", () => {
           const genre = serviceGroup.genres[1]
           genre.type_.should.equal(GENRE_TYPE.SECONDARY)
       }),
       it("parses the other genre type correctly", () => {
           const genre = serviceGroup.genres[2]
           genre.type_.should.equal(GENRE_TYPE.OTHER)
       })
    }),
    describe("keywords", () => {
        it("has the correct number of keywords", () => {
            serviceGroup.keywords.length.should.equal(4)
        }),
        it("parses the keywords correctly", () => {
            serviceGroup.keywords[0].should.equal("test")
            serviceGroup.keywords[1].should.equal("service")
            serviceGroup.keywords[2].should.equal("radio")
            serviceGroup.keywords[3].should.equal("spi")
        })
    }),
    describe("links", () => {
        it("has the correct number of links", () => {
            serviceGroup.links.length.should.equal(3)
        }),
        it("parses the link correctly", () => {
            const link = serviceGroup.links[2]
            link.uri.should.equal("http://example.net/schedule")
            link.mimeValue.should.equal("text/html")
            link.lang.should.equal("en")
            link.description.should.equal("Permanent Schedule")
            const expiry = link.expiryTime.unix()
            expiry.should.equal(4100781600)
            link.expired.should.be.false
        }),
        it("does not include expired links", () => {
            const link = serviceGroup.links[1]
            link.uri.should.not.equal("http://example.net/promotion")
        })
    }),
    describe("long name", () => {
        it("parses the long name correctly", () => {
            serviceGroup.longName.should.equal("Test Group Long Name")
        })
    }),
    describe("multimedia", () => {
        it('has the correct number of items', () => {
            serviceGroup.multimedia.length.should.equal(6)
        }),
        it('passes each multimedia element correctly', () => {
            const multimedia = serviceGroup.multimedia[2]
            multimedia.mimeValue.should.equal("image/png")
            multimedia.url.should.equal("http://via.placeholder.com/128x128.png")
            multimedia.width.should.equal(128)
            multimedia.height.should.equal(128)
        })
    }),
    describe("long description", () => {
        it("parses the long description correctly", () => {
            serviceGroup.longDescription.should.equal("Test Long Description")
        })
    }),
    describe("short name", () => {
        it("parses the short name correctly", () => {
            serviceGroup.shortName.should.equal("TestGrp")
        })
    }),
    describe("medium name", () => {
        it("parses the medium name correctly", () => {
            serviceGroup.mediumName.should.equal("Test Group")
        })

    }),
    describe("short description", () => {
        it("parses the short description correctly", () => {
            serviceGroup.shortDescription.should.equal("Test Short Description")
        })

    })
})
