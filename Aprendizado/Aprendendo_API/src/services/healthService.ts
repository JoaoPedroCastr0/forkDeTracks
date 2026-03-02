import { HealthRepository } from "../repository/healthRepository";
import type { HealthDTO } from "../DTOs/health.schema";

export class HealthService {
  constructor(private repository: HealthRepository) {}

  getStatus(params?: HealthDTO) {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      dependencies: {
        tasksRepository: this.repository.checkTasksRepository(),
        database:
          params?.checkDB !== false
            ? this.repository.checkDatabase()
            : "skipped",
        cache:
          params?.checkCache !== false
            ? this.repository.checkCache()
            : "skipped"
      }
    }
  }
}