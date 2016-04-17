import React from 'react';
import ReactDOM from 'react-dom';
import Filesharer from './components/filesharer.jsx';

const options = {
    peerjs_key: '3ilxc4huu6usor'
};

const Main = React.createClass({
    render: function () {
        return <Filesharer opts={options} />;
    }
});

const main = document.getElementById('main');

ReactDOM.render(<Main/>, main);