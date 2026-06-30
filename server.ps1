# Servidor HTTP ultraligero en PowerShell para el Prototipo
$port = 8000
$http = New-Object System.Net.HttpListener
$http.Prefixes.Add("http://localhost:$port/")
try {
    $http.Start()
    Write-Host "Servidor iniciado en http://localhost:$port/"
} catch {
    Write-Error "No se pudo iniciar el servidor en el puerto $port. Asegúrate de que no esté ocupado."
    exit
}

$workspace = "C:\Users\leofa\.gemini\antigravity-ide\scratch\a1click-prototype"

while ($http.IsListening) {
    try {
        $context = $http.GetContext()
        $req = $context.Request
        $res = $context.Response
        
        $path = $req.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        # Obtener ruta absoluta del archivo
        $localFile = [System.IO.Path]::Combine($workspace, $path.TrimStart('/'))
        
        if (Test-Path $localFile -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            
            # Asignar Content-Type adecuado
            if ($localFile.EndsWith(".html")) { $res.ContentType = "text/html; charset=utf-8" }
            elseif ($localFile.EndsWith(".css")) { $res.ContentType = "text/css; charset=utf-8" }
            elseif ($localFile.EndsWith(".js")) { $res.ContentType = "application/javascript; charset=utf-8" }
            elseif ($localFile.EndsWith(".png")) { $res.ContentType = "image/png" }
            elseif ($localFile.EndsWith(".webp")) { $res.ContentType = "image/webp" }
            
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            Write-Host "No encontrado (404): $path"
            $res.StatusCode = 404
        }
        $res.Close()
    } catch {
        # Ignorar errores de conexión interrumpida o cancelación
    }
}
