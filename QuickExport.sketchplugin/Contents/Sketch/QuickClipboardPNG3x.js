@import 'common.js'

var onRun = function (context) {

    // Grab output path
    var fileManager = NSFileManager.defaultManager();
    var pathId = NSCachesDirectory;
    var paths = [fileManager URLsForDirectory:pathId inDomains:NSUserDomainMask];
    var file_path_base = [[paths objectAtIndex:0] path];
    var file_path = null;
    for (var i = 0; i < 100; i++) {
        file_path = [file_path_base stringByAppendingPathComponent: "tmp_sketch_export_" + i + ".png"];
        if (!fileManager.fileExistsAtPath(file_path)) {
            break;
        }
        [fileManager removeItemAtPath:file_path error:null];
        if (!fileManager.fileExistsAtPath(file_path)) {
            break;
        }
    }
    log(file_path);

    // Reset clipboard
    var pasteboard = NSPasteboard.generalPasteboard();
    pasteboard.clearContents();

    // Grab selection
    var doc = context.document;
    var selection = context.selection;
    var copiedObjects = NSMutableArray.array();
    for (var i = 0; i < selection.count(); i++) {

        // Prep slice
        var s = selection[i];
        var c = s.duplicate();
        c.exportOptions().removeAllExportFormats();
        var exportOption = c.exportOptions().addExportFormat();
        exportOption.setScale(3);
        exportOption.setName("@3x");

        var slices = MSExportRequest.exportRequestsFromExportableLayer(c);
        for (var j = 0; j < slices.count(); j++) {
            [doc saveArtboardOrSlice:slices[j] toFile:file_path];
        }

        // Revert layer object
        c.removeFromParent();

        // Read from disk, add to clipboard array
        var image = NSImage.alloc().initWithContentsOfFile(file_path);
        if (image) {
            copiedObjects.addObject(image);
        }

        // Clear file immediately
        [fileManager removeItemAtPath:file_path error:null];
    }

    // Save clipboard. Doesn't actually seem to work for > 1 image.
    // Perhaps requires additional representations? Not fixing for now.
    pasteboard.writeObjects(copiedObjects);
    log("wrote " + copiedObjects.count() + " images to clipboard");
}

onRun(context);