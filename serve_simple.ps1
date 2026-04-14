$p = 8080
$d = "C:\Users\DELL\.gemini\antigravity\scratch\dental-care"
if (!(Test-Path $d)) { throw "Directory not found: $d" }
$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add("http://localhost:$p/")
$l.Start()
Write-Host "Serving $d at http://localhost:$p/"
while ($l.IsListening) {
    try {
        $c = $l.GetContext()
        $r = $c.Request
        $s = $c.Response
        $u = $r.Url.LocalPath
        if ($u -eq "/") { $u = "/index.html" }
        $f = Join-Path $d $u
        if (Test-Path $f -PathType Leaf) {
            $b = [System.IO.File]::ReadAllBytes($f)
            $ext = [System.IO.Path]::GetExtension($f).ToLower()
            $s.ContentType = switch($ext) {
                ".html" { "text/html" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                default { "application/octet-stream" }
            }
            $s.ContentLength64 = $b.Length
            $s.OutputStream.Write($b, 0, $b.Length)
        } else {
            $s.StatusCode = 404
        }
        $s.Close()
    } catch {
        Write-Host "Error: $_"
    }
}
