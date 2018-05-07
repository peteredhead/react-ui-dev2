import React, { Component } from 'react';
import './App.css';
import SI from './lib/SI'
import {DOMParser} from 'xmldom'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = { names: []}
    }

    componentWillMount() {
        fetch('/radiodns/spi/3.1/SI.xml')
        .then(response => {
            if (response.ok) {
                return response.text()
            } else {
                console.error(response.statusText)
                return
            }
        })
        .then(text => {
            var parser = new DOMParser()
            const data = parser.parseFromString(text, "text/xml");
            const si = new SI()
            si.parse(data)
            let names = []
            const groups = si.getServiceGroups()
            for (var groupId in groups) {
                names.push(groups[groupId].getName())
            }
            const nonGroupServices = si.getAllNonGroupServices()
            for (var i = 0; i < nonGroupServices.length; i++) {
                names.push(nonGroupServices[i].getName())
            }
            this.setState({names: names})
        })
    }

    render() {
        if (this.state.names.length === 0) {
            return (<h2>Loading...</h2>)
        }

        return (
            <div>
                {this.state.names.map((name, key) => {
                    return (<h3 key={key}>{name}</h3>)
                })}
            </div>
        );
    }
}

export default App;
