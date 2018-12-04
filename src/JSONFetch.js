class JSONFetch{
     
    constructor(divId){
        this.fileInput = document.createElement("input")
        this.fileInput.setAttribute('id', 'JSONFetch')
        this.fileInput.setAttribute('type', 'file')
        this.fileInput.setAttribute('style', 'display: none;')
        var element = document.getElementById(divId)
        element.appendChild(this.fileInput)
        this.file = ""
        this.JSONResult = "err"
    }

    selectJSON(){
        this.fileInput.click();
    }

    processJSON(_callback) {
        var reader = new FileReader()
        reader.readAsText(this.fileInput.files[0])
        this.file = reader.result;
        reader.onload = function(e){
            this.file = reader.result
            _callback(jQuery.parseJSON(this.file))
        }
    }
}