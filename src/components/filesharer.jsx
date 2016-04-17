import React from 'react';
import randomstring from 'randomstring';
import Peer from 'peerjs';

class FileSharer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            peer: new Peer({
                key: this.props.opts.peerjs_key
            }),
            /*
             //for production:
             peer = new Peer({
             host: 'yourwebsite.com', port: 3000, path: '/peerjs',
             debug: 3,
             config: {'iceServers': [
             { url: 'stun:stun1.l.google.com:19302' },
             { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
             ]}
             })
             */
            my_id: '',
            peer_id: '',
            initialized: false,
            files: []
        };
    }

    componentWillMount() {
        this.state.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            this.setState({
                my_id: id,
                initialized: true
            });
        });

        this.state.peer.on('connection', (connection) => {
            console.log('someone connected');
            console.log(connection);

            this.setState({
                conn: connection
            }, () => {

                this.state.conn.on('open', () => {
                    this.setState({
                        connected: true
                    });
                });

                this.state.conn.on('data', this.onReceiveData.bind(this));

            });


        });
    }

    componentWillUnmount() {
        this.state.peer.destroy();
    }

    connect() {
        const peer_id = this.state.peer_id;

        const connection = this.state.peer.connect(peer_id);

        this.setState({
            conn: connection
        }, () => {
            this.state.conn.on('open', () => {
                this.setState({
                    connected: true
                });
            });

            this.state.conn.on('data', this.onReceiveData.bind(this));

        });
    }

    sendFile(event) {
        console.log(event.target.files);
        const file = event.target.files[0];
        const blob = new Blob(event.target.files, {type: file.type});

        this.state.conn.send({
            file: blob,
            filename: file.name,
            filetype: file.type
        });
    }

    onReceiveData(data) {
        console.log('Received', data);

        const blob = new Blob([data.file], {type: data.filetype});
        const url = URL.createObjectURL(blob);

        this.addFile({
            'name': data.filename,
            'url': url
        });
    }

    addFile(file) {
        const file_name = file.name;
        const file_url = file.url;

        let files = this.state.files;
        const file_id = randomstring.generate(5);

        files.push({
            id: file_id,
            url: file_url,
            name: file_name
        });

        this.setState({
            files: files
        });
    }

    handleTextChange(event) {
        this.setState({
            peer_id: event.target.value
        });
    }

    renderNotConnected() {
        return (
            <div>
                <hr />
                <div className="mui-textfield">
                    <input type="text" className="mui-textfield" onChange={this.handleTextChange.bind(this)} />
                    <label>{this.props.opts.peer_id_label || 'Peer ID'}</label>
                </div>
                <button className="mui-btn mui-btn--accent" onClick={this.connect.bind(this)}>
                    {this.props.opts.connect_label || 'connect'}
                </button>
            </div>
        );
    }

    renderConnected() {
        return (
            <div>
                <hr />
                <div>
                    <input type="file" name="file" id="file" className="mui--hide" onChange={this.sendFile.bind(this)} />
                    <label htmlFor="file" className="mui-btn mui-btn--small mui-btn--primary mui-btn--fab">+</label>
                </div>
                <div>
                    <hr />
                    {this.state.files.length ? this.renderListFiles() : this.renderNoFiles()}
                </div>
            </div>
        );
    }

    renderListFiles() {
        return (
            <div id="file_list">
                <table className="mui-table mui-table--bordered">
                    <thead>
                    <tr>
                        <th>{this.props.opts.file_list_label || 'Files shared to you: '}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.files.map(this.renderFile, this)}
                    </tbody>
                </table>
            </div>
        );
    }

    renderFile(file) {
        return (
            <tr key={file.id}>
                <td>
                    <a href={file.url} download={file.name}>{file.name}</a>
                </td>
            </tr>
        );
    }

    renderNoFiles() {
        return (
            <span id="no_files_message">
            {this.props.opts.no_files_label || 'No files shared to you yet'}
        </span>
        );
    }

    render() {
        var result;

        if(this.state.initialized){
            result = (
                <div>
                    <div>
                        <span>{this.props.opts.my_id_label || 'Your PeerJS ID:'} </span>
                        <strong className="mui--divider-left">{this.state.my_id}</strong>
                    </div>
                    {this.state.connected ? this.renderConnected() : this.renderNotConnected()}
                </div>
            );
        } else {
            result = <div>Loading...</div>;
        }

        return result;
    }
}

FileSharer.propTypes = {
    opts: React.PropTypes.object
};

export default FileSharer;