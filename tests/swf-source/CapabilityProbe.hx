package;

import flash.display.Loader;
import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.external.ExternalInterface;
import flash.net.URLLoader;
import flash.net.URLLoaderDataFormat;
import flash.net.URLRequest;
import flash.text.TextField;
import flash.text.TextFormat;

/**
 * Project-authored AVM2 fixture. It contacts only static files in the app's
 * own test-fixtures directory and reports through the test-only JS callback.
 */
class CapabilityProbe {
  public static function main():Void {
    var root = flash.Lib.current;
    root.graphics.beginFill(0x1b262b);
    root.graphics.drawRect(0, 0, 640, 360);
    root.graphics.endFill();

    var label = new TextField();
    label.defaultTextFormat = new TextFormat("_sans", 18, 0xe5eee8);
    label.text = "Naruto Online Mobile · Ruffle capability probe";
    label.x = 18;
    label.y = 14;
    label.width = 600;
    label.height = 36;
    root.addChild(label);

    report("as3-avm2", true, "O ponto de entrada ActionScript 3 foi executado.");

    if (ExternalInterface.available) {
      ExternalInterface.addCallback("capabilityPing", function(value:String):String {
        return "pong:" + value;
      });
      ExternalInterface.call("onRuffleCapabilityLabResult", "bridge-ready", true, "Callback ActionScript registado.");
    }

    var textLoader = new URLLoader();
    textLoader.dataFormat = URLLoaderDataFormat.TEXT;
    textLoader.addEventListener(Event.COMPLETE, function(_:Event):Void {
      var actual:String = cast textLoader.data;
      report("url-loader", actual == "ruffle-url-loader-fixture-v1", actual);
    });
    textLoader.addEventListener(IOErrorEvent.IO_ERROR, function(_:IOErrorEvent):Void {
      report("url-loader", false, "IOErrorEvent ao ler o recurso estático local.");
    });
    try {
      textLoader.load(new URLRequest("capability-resource.txt"));
    } catch (error:Dynamic) {
      report("url-loader", false, Std.string(error));
    }

    var childLoader = new Loader();
    childLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, function(_:Event):Void {
      childLoader.x = 18;
      childLoader.y = 72;
      root.addChild(childLoader);
      report("external-swf", true, "O SWF filho externo foi carregado e anexado.");
    });
    childLoader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, function(_:IOErrorEvent):Void {
      report("external-swf", false, "IOErrorEvent ao carregar o SWF filho local.");
    });
    try {
      childLoader.load(new URLRequest("capability-child.swf"));
    } catch (error:Dynamic) {
      report("external-swf", false, Std.string(error));
    }
  }

  private static function report(id:String, passed:Bool, detail:String):Void {
    if (ExternalInterface.available) {
      ExternalInterface.call("onRuffleCapabilityLabResult", id, passed, detail);
    }
  }
}
