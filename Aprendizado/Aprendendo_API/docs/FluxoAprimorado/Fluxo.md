Login → gera token
       ↓
Request protegida → authMiddleware
                      ↓
               injeta user dentro de req, gerando: req.user
                      ↓
Controller usa req.user