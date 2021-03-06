class LoadingGraphics{
    constructor()
    {
        this.myelement = document.createElement("IMG")
        this.myelement.src = "Loading.gif"
        this.myelement.style = "width:200px;height:200px;"
    }

    addTo(divid, white = false)
    {
        var parent = document.getElementById(divid)
        if(white)
        {
            this.myelement.src = "LoadingWhite.gif" 
        }
        else
        {
            this.myelement.src = "Loading.gif"
        }
        parent.appendChild(this.myelement)
    }
    
    remove()
    {
        if(this.myelement.parentNode){
            this.myelement.parentNode.removeChild(this.myelement)
        }
    }
}