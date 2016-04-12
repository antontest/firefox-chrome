var actsw  = document.getElementById("activeswitch1"),
    dimbrs = document.getElementById("activeswitch2"),
    dimweb = document.getElementById("activeswitch3"),
    dimimg = document.getElementById("activeswitch4"),
    autosw = document.getElementById("activeswitch5"),
    beginh = document.getElementById("beginh"),
    beginm = document.getElementById("beginm"),
    endh   = document.getElementById("endh"),
    endm   = document.getElementById("endm");
actsw.addEventListener("click", function() {
    this.checked ? self.port.emit("option", {
        cmd: "on"
    }) : self.port.emit("option", {
        cmd: "off"
    })
});

dimbrs.addEventListener("click", function() {
    this.checked ? self.port.emit("option", {
        cmd: "brs",
        type: "on"
    }) : self.port.emit("option", {
        cmd: "brs",
        type: "off"
    })
});

dimweb.addEventListener("click", function() {
    this.checked ? self.port.emit("option", {
        cmd: "web",
        type: "on"
    }) : self.port.emit("option", {
        cmd: "web",
        type: "off"
    })
});

dimimg.addEventListener("click", function() {
    this.checked ? self.port.emit("option", {
        cmd: "img",
        type: "on"
    }) : self.port.emit("option", {
        cmd: "img",
        type: "off"
    })
});

autosw.addEventListener("click", function() {
    this.checked ? (self.port.emit("option", {
        cmd: "auto",
        type: "on"
    }), showAutoOptions("block")) : (self.port.emit("option", {
        cmd: "auto",
        type: "off"
    }), showAutoOptions("none"))
});
beginh.addEventListener("change", function() {
    self.port.emit("option", {
        cmd: "auto",
        type: "beginh",
        value: this.value
    })
});
beginm.addEventListener("change", function() {
    self.port.emit("option", {
        cmd: "auto",
        type: "beginm",
        value: this.value
    })
});
endh.addEventListener("change", function() {
    self.port.emit("option", {
        cmd: "auto",
        type: "endh",
        value: this.value
    })
});
endm.addEventListener("change", function() {
    self.port.emit("option", {
        cmd: "auto",
        type: "endm",
        value: this.value
    })
});
self.port.on("stat", function(a) {
    actsw.checked = "on" == a.stat ? !0 : !1;
    dimbrs.checked = 1 == a.brs ? !0 : !1;
    dimweb.checked = 1 == a.web ? !0 : !1;
    dimimg.checked = 1 == a.img ? !0 : !1;
    autosw.checked = 1 == a.auto ? !0 : !1;
    beginh.selectedIndex = a.beginh;
    beginm.selectedIndex = a.beginm;
    endh.selectedIndex = a.endh;
    endm.selectedIndex = a.endm;
    showAutoOptions(1 == a.auto ? "block" : "none")
});
self.port.on("toggle", function(a) {
    actsw.checked = 1 == a.value ? !0 : !1
});

function showAutoOptions(a) {
    for (var c = document.getElementsByClassName("optiongrp"), b = 0; b < c.length; b++) c[b].style.display = a
}