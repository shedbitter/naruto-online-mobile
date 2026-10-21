package;

import flash.text.TextField;
import flash.text.TextFormat;

/** A small project-authored external SWF loaded by CapabilityProbe. */
class CapabilityChild {
  public static function main():Void {
    var label = new TextField();
    label.defaultTextFormat = new TextFormat("_sans", 16, 0xa9d9b4);
    label.text = "SWF filho carregado";
    label.x = 8;
    label.y = 8;
    label.width = 320;
    label.height = 48;
    flash.Lib.current.addChild(label);
  }
}
