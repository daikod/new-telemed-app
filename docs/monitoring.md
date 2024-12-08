# Monitoring Video Conferences

## Jitsi Meet Monitoring

### 1. View Active Calls
```bash
# Check active conferences
docker-compose exec prosody prosodyctl mod_muc_conferences
```

### 2. Monitor Resources
```bash
# View Jitsi resource usage
docker stats jitsi prosody

# Check video bridge status
curl http://localhost:8080/colibri/stats
```

### 3. Logging
```bash
# Enable debug logging
docker-compose exec prosody prosodyctl shell
> debug = true
``` 