class LoadingGraphics{
    constructor()
    {
        this.myelement = document.createElement("IMG")
        this.myelement.src = "Loading.gif"
        this.myelement.style = "width:200px;height:200px;"
    }

    addTo(divid)
    {
        var parent = document.getElementById(divid)
        parent.appendChild(this.myelement)
    }
    
    remove()
    {
        this.myelement.parentNode.removeChild(this.myelement)
    }
}