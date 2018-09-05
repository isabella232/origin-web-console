'use strict';

/* A WebSocket factory for kubernetesContainerTerminal */
angular.module('openshiftConsole')
.factory("ContainerWebSocket", function(API_CFG, $ws) {
  return function AuthWebSocket(url, protocols) {
    if (url.match(/\/apis\/subresources.*\/virtualmachineinstances\/.*\/console/)) {
      // quick hack for virtual machine console
      // Example: wss://localhost:8443/apis/subresources.kubevirt.io/v1alpha2/namespaces/kube-system/virtualmachineinstances/vm-cirros/console/exec?stdout=1&stdin=1&stderr=1&tty=1&container=Name%20-%20TODO&command=%2Fbin%2Fsh&command=-i
      url = url.replace(/\/console\/exec\?.*/, '/console');
      protocols = ['plain.kubevirt.io'];
    }

    var scheme;
    if (url.indexOf("/") === 0) {
      scheme = window.location.protocol === "http:" ? "ws://" : "wss://";
      url = scheme + API_CFG.openshift.hostPort + url;
    }
    console.log('ContainerWebSocket url: ', url);
    console.log('ContainerWebSocket protocols: ', protocols);
  // TODO: add Authorization header to the HTTP handshake
    return $ws({ url: url, method: "WATCH", protocols: protocols, auth: {} });
  };
});
