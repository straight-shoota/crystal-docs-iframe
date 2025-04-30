window.CrystalDocs = (window.CrystalDocs || {});

CrystalDocs.base_path = (CrystalDocs.base_path || "");

var UsageModal = function(title, content) {
  var $body = document.body;
  var self = this;
  var $modalBackground = document.createElement("div");
  $modalBackground.classList.add("modal-background");
  var $usageModal = document.createElement("div");
  $usageModal.classList.add("usage-modal");
  $modalBackground.appendChild($usageModal);
  var $title = document.createElement("h3");
  $title.classList.add("modal-title");
  $title.innerHTML = title
  $usageModal.appendChild($title);
  var $closeButton = document.createElement("span");
  $closeButton.classList.add("close-button");
  $closeButton.setAttribute("title", "Close modal");
  $closeButton.innerText = '×';
  $usageModal.appendChild($closeButton);
  $usageModal.insertAdjacentHTML("beforeend", content);

  $modalBackground.addEventListener('click', function(event) {
    var element = event.target || event.srcElement;

    if(element == $modalBackground) {
      self.hide();
    }
  });
  $closeButton.addEventListener('click', function(event) {
    self.hide();
  });

  $body.insertAdjacentElement('beforeend', $modalBackground);

  this.show = function(){
    $body.classList.add("js-modal-visible");
  };
  this.hide = function(){
    $body.classList.remove("js-modal-visible");
  };
  this.isVisible = function(){
    return $body.classList.contains("js-modal-visible");
  }
}


document.addEventListener('DOMContentLoaded', function() {
  var usageModal = new UsageModal('Keyboard Shortcuts', '' +
      '<ul class="usage-list">' +
      '  <li>' +
      '    <span class="usage-key">' +
      '      <kbd>s</kbd>,' +
      '      <kbd>/</kbd>' +
      '    </span>' +
      '    Search' +
      '  </li>' +
      '  <li>' +
      '    <kbd class="usage-key">Esc</kbd>' +
      '    Abort search / Close modal' +
      '  </li>' +
      '  <li>' +
      '    <span class="usage-key">' +
      '      <kbd>⇨</kbd>,' +
      '      <kbd>Enter</kbd>' +
      '    </span>' +
      '    Open highlighted result' +
      '  </li>' +
      '  <li>' +
      '    <span class="usage-key">' +
      '      <kbd>⇧</kbd>,' +
      '      <kbd>Ctrl+j</kbd>' +
      '    </span>' +
      '    Select previous result' +
      '  </li>' +
      '  <li>' +
      '    <span class="usage-key">' +
      '      <kbd>⇩</kbd>,' +
      '      <kbd>Ctrl+k</kbd>' +
      '    </span>' +
      '    Select next result' +
      '  </li>' +
      '  <li>' +
      '    <kbd class="usage-key">?</kbd>' +
      '    Show usage info' +
      '  </li>' +
      '</ul>'
    );
    function searchAction() {
      if(usageModal.isVisible()) {
        return;
      }
      sidebarIframe.contentWindow.postMessage({action: "performSearch"}, "*")
    }

    window.addEventListener("message", function(event) {
      switch(event.data.action) {
        case "showUsageModal":
          usageModal.show();
          break;
        case "escape":
          usageModal.hide();
          break;
        case "search":
          searchAction();
          break;
      }
    })

    function handleShortkeys(event) {
      var element = event.target || event.srcElement;

      if(element.tagName == "INPUT" || element.tagName == "TEXTAREA" || element.parentElement.tagName == "TEXTAREA"){
        return;
      }

      switch(event.key) {
        case "?":
          usageModal.show();
          break;

        case "Escape":
          usageModal.hide();
          break;

        case "s":
        case "/":
          event.stopPropagation();
          searchAction()
          break;
      }
    }

  document.addEventListener('keyup', handleShortkeys);

  var scrollToEntryFromLocationHash = function() {
    var hash = window.location.hash;
    if (hash) {
      var targetAnchor = decodeURI(hash.substr(1));
      var targetEl = document.getElementById(targetAnchor)
      if (targetEl) {
        targetEl.offsetParent.scrollTop = targetEl.offsetTop;
      }
    }
  };
  window.addEventListener("hashchange", scrollToEntryFromLocationHash, false);
  scrollToEntryFromLocationHash();

  var sidebarIframe = document.querySelector(".sidebar")
  sidebarIframe.addEventListener("load", function(){
    sidebarIframe.contentWindow.postMessage({
      action: "initType",
      url: window.location.href,
      isWideViewport: !(window.matchMedia('only screen and (max-width: 635px)')).matches
    }, "*")
  });

});
