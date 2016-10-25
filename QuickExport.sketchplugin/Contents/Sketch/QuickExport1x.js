@import 'common.js'

var onRun = function(context) {
	var doc = context.document;
    var selection = context.selection;
    var file_path = selectFolder();
    for(var i = 0; i < selection.count(); i++){
        var s = selection[i];
        var sName = s.name();
        var rect  = [MSSliceTrimming trimmedRectForSlice:s];
        var slice = [MSExportRequest requestWithRect:rect scale:1];
        doc.saveArtboardOrSlice_toFile(slice,file_path+"/"+sName+".png");
    }
}

function selectFolder(){
  //open a window to select a folder to save to
  var panel = [NSOpenPanel openPanel];
  [panel setCanChooseDirectories:true];
  [panel setCanCreateDirectories:true];

  //checks if user clicks open in window
  var clicked = [panel runModal];
  if (clicked == NSFileHandlingPanelOKButton) {

    var isDirectory = true;
    var firstURL = [[panel URLs] objectAtIndex:0];
    var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];

    //makes sure spaces aren't formatted to %20
    var file_path = [unformattedURL stringByRemovingPercentEncoding];

    //removes file:// from path
    if (0 === file_path.indexOf("file://")) {
       file_path = file_path.substring(7);
       return file_path;
    }
  }
}
