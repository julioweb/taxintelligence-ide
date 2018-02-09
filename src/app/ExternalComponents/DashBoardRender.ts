export var TokenType_OAUTH = 1;
export var TokenType_TOKENPORTALOLD = 2;

export var DashBoardRender = (function (self) {


    function IsNullOrEmpty(vTmp) {
        return vTmp == "" || vTmp == null;
    }

    self.UrlDashBoardUI = self.UrlDashBoardUI || "https://dashboard.avalarabrasil.com.br/";
    self.UrlImgLoad = self.UrlImgLoad || "https://ava-s3-prd-portalfiles.s3.amazonaws.com/dashboard/img/loading.gif";
    self.Id = self.Id || null;
    self.DashBoardGuidId = self.DashBoardGuidId || null;
    self.TokenType = self.TokenType || null;
    self.Token = self.Token || null;
    self.AppId = self.AppId || null;

    if (document.getElementById(self.Id) == null)
        console.log("DashBoardRender id invalid '" + self.Id + "'");

    var IFrame = null;
    var ImgLoad = null;

    if (IsNullOrEmpty(self.Id))
        console.log("DashBoardStart.Id not found");

    if (IsNullOrEmpty(self.DashBoardGuidId))
        console.log("DashBoardStart.DashBoardGuidId not found");

    if (IsNullOrEmpty(self.Token))
        console.log("DashBoardStart.Token not found");

    if (self.TokenType == null || (self.TokenType != TokenType_OAUTH && self.TokenType != TokenType_TOKENPORTALOLD))
        console.log("DashBoardStart.TokenType not found or invalid");

    if (IsNullOrEmpty(self.AppId))
        console.log("DashBoardStart.AppId not found ");


    self.Render = function () {

        var vObj = document.getElementById(self.Id);
        vObj.innerHTML = "";

        vObj.style.textAlign = "center";

        IFrame = document.createElement("iframe");
        IFrame.setAttribute("src", self.UrlDashBoardUI + self.Id);
        IFrame.style.width = "1px";
        IFrame.style.height = "1px";
        IFrame.style.border = "0px";
        IFrame.style.position = "absolute";
        IFrame.style.left = "-10000px";
        IFrame.style.top = "-10000px";
        vObj.appendChild(IFrame);

        ImgLoad = document.createElement("img");
        ImgLoad.setAttribute("src", self.UrlImgLoad);
        ImgLoad.style.maxWidth = "40px";
        vObj.appendChild(ImgLoad);
    };

    function OnLoad() {
        ImgLoad.style.display = "none";
        IFrame.style.width = "100%";
        IFrame.style.height = "100%";

        IFrame.style.position = "";
        IFrame.style.left = "";
        IFrame.style.top = "";

        if (!IFrame.contentWindow.postMessage)
            return;

        IFrame.contentWindow.postMessage(JSON.stringify({
            Method: "DashBoard_SetIdentification",
            DashBoardGuidId: self.DashBoardGuidId,
            TokenType: self.TokenType,
            Token: self.Token,
            AppId: self.AppId
        }), "*");


    }

    function receiveMessage(e) {
        let vMessage: {
            Method: string,
            InstaceId: string,
            width: string,
            height: string
        };
        try {
            vMessage = JSON.parse(e.data);
        }
        catch (err) { }

        if (vMessage == null)
            return;
        if (vMessage.Method == "DashBoard_OnLoad" && vMessage.InstaceId == self.Id) {
            OnLoad();
        }
        else if (vMessage.Method == "DashBoard_SetWidthHeight" && vMessage.InstaceId == self.Id) {
            if (vMessage.width != null)
                IFrame.style.width = vMessage.width;

            if (vMessage.height != null)
                IFrame.style.height = vMessage.height;
        }

    }

    self.Render();

    window.addEventListener("message", receiveMessage, false);
    return self;
});