Login → gera token
       ↓
Request protegida → authMiddleware
                      ↓
               injeta req.user
                      ↓
Controller usa req.user