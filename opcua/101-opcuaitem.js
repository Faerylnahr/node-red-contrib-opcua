/**

 Copyright 2015 Valmet Automation Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/

module.exports = function (RED) {
    "use strict";
    var opcua = require('node-opcua');
    var opcuaBasics = require('./opcua-basics');

    function OpcUaItemNode(n) {

        RED.nodes.createNode(this, n);

        this.item = n.item;         // OPC UA address: ns=2;i=4 OR ns=3;s=MyVariable
        this.datatype = n.datatype; // String;
        this.value = n.value;       // 66.6
        this.name = n.name;         // browseName shall be put here

        var node = this;

        function verbose_warn(logMessage) {
            if (RED.settings.verbose) {
                node.warn((node.name) ? node.name + ': ' + logMessage : 'OpcUaClientNode: ' + logMessage);
            }
        }

        function verbose_log(logMessage) {
            if (RED.settings.verbose) {
                node.log(logMessage);
            }
        }

        node.on("input", function (msg) {

            msg.topic = node.item;
            msg.datatype = node.datatype;
            msg.browseName = node.name;

            verbose_log('node value:' + node.value);

            if (node.value) {
				if (node.datatype) {
					msg.payload = opcuaBasics.build_new_value_by_datatype(node.datatype, node.value);
				}
				if (msg.datatype) {
					msg.payload = opcuaBasics.build_new_value_by_datatype(msg.datatype, node.value);
				}
                verbose_warn("setting value by Item " + msg.payload);
            } else {
                msg.payload = opcuaBasics.build_new_value_by_datatype(msg.datatype, msg.payload);
                verbose_warn("setting value by Input " + msg.payload);
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("OpcUa-Item", OpcUaItemNode);
};
