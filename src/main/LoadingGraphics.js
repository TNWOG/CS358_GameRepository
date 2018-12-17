class LoadingGraphics{
    constructor()
    {
        //create element
        this.myelement = document.createElement("IMG")
        this.myelement.src = "Loading.gif"
        this.myelement.style = "width:200px;height:200px;"
    }

    addTo(divid, white = false)
    {
        //place element in id in file
        var parent = document.getElementById(divid)
        //change source dependent on background
        if(white)
        {
            this.myelement.src = "LoadingWhite.gif" 
        }
        else
        {
            this.myelement.src = "Loading.gif"
        }
        //add element to node
        parent.appendChild(this.myelement)
    }
    
    remove()
    {
        //remove element from parent
        if(this.myelement.parentNode){
            this.myelement.parentNode.removeChild(this.myelement)
        }
    }
}