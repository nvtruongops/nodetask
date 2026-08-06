const path = require('path');
const meta = require('./meta.json');

module.exports = {
  meta,
  async execute(ctx) {
    let violations = 0;
    const skillsDir = path.join(ctx.workspaceRoot, '.agents/skills');

    if (!ctx.fs.existsSync(skillsDir)) {
      ctx.logger.error('Thiếu thư mục .agents/skills');
      return { passed: false };
    }

    const skillFolders = ctx.fs.readdirSync(skillsDir).filter(f => {
      const fullPath = path.join(skillsDir, f);
      return ctx.fs.statSync(fullPath).isDirectory();
    });

    let registrySkills = (ctx.registry && ctx.registry.skills) ? ctx.registry.skills : null;
    if (!registrySkills) {
      const regPath = path.join(ctx.workspaceRoot, '.agents/registry.json');
      if (ctx.fs.existsSync(regPath)) {
        try {
          const regJson = JSON.parse(ctx.fs.readFileSync(regPath, 'utf8'));
          registrySkills = regJson.skills || {};
        } catch (e) {
          registrySkills = {};
        }
      } else {
        registrySkills = {};
      }
    }

    for (const folder of skillFolders) {
      const folderPath = path.join(skillsDir, folder);
      const skillMd = path.join(folderPath, 'SKILL.md');
      const skillYaml = path.join(folderPath, 'skill.yaml');

      if (!ctx.fs.existsSync(skillMd)) {
        ctx.logger.error(`Skill folder [${folder}] thiếu SKILL.md`);
        violations++;
      }

      if (!ctx.fs.existsSync(skillYaml)) {
        ctx.logger.error(`Skill folder [${folder}] thiếu skill.yaml manifest hợp đồng`);
        violations++;
      } else {
        const yamlContent = ctx.fs.readFileSync(skillYaml, 'utf8');
        const requiredFields = ['name', 'version', 'description', 'minGovernanceVersion', 'priority', 'capabilities', 'executionMode'];
        
        for (const field of requiredFields) {
          if (!yamlContent.includes(`${field}:`)) {
            ctx.logger.error(`Skill [${folder}] skill.yaml thiếu trường bắt buộc: ${field}`);
            violations++;
          }
        }
      }

      // Check registry matching
      if (!registrySkills[folder]) {
        ctx.logger.error(`Skill [${folder}] chưa được đăng ký trong .agents/registry.json`);
        violations++;
      } else {
        const regEntry = registrySkills[folder];
        if (!regEntry.manifestPath || !ctx.fs.existsSync(path.join(ctx.workspaceRoot, regEntry.manifestPath))) {
          ctx.logger.error(`Skill [${folder}] trong registry.json trỏ tới manifestPath không tồn tại`);
          violations++;
        }
      }
    }

    if (violations === 0) {
      ctx.logger.pass(`Tất cả ${skillFolders.length} local skills đều có skill.yaml manifest hợp lệ và đồng bộ với registry.json.`);
    }

    return { passed: violations === 0 };
  }
};
