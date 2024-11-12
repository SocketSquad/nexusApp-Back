"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await app.listen(process.env.PORT || 3000);
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
    catch (error) {
        console.error('Application failed to start:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map