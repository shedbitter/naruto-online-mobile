# Ruffle test fixtures

These tiny SWFs are project-authored test programs, compiled from `tests/swf-source/` with Haxe 4.3.7's Flash target (SWF version 32 / AVM2). They contain no Naruto Online code, assets, accounts, or service endpoints.

The probe's only network requests are same-origin GETs for `capability-resource.txt` and `capability-child.swf`, and both occur only after the user presses **Executar ensaios**. The trusted probe alone is loaded with Ruffle's `allowScriptAccess: true` and `allowNetworking: "all"`; user-selected SWFs keep the application's restricted settings.

To rebuild the binaries with Haxe 4.3.7:

```powershell
haxe -cp tests/swf-source -main CapabilityProbe -swf public/test-fixtures/ruffle-capability-probe.swf -swf-version 32 -D 'swf-header=640:360:30:1b262b'
haxe -cp tests/swf-source -main CapabilityChild -swf public/test-fixtures/capability-child.swf -swf-version 32 -D 'swf-header=320:180:30:1b262b'
```

The Haxe compiler is a build tool only and is not an application dependency.
