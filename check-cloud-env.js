// 检查云环境配置
const fs = require('fs');
const path = require('path');

// 读取 app.js 中的云环境配置
function checkAppConfig() {
  try {
    const appJsPath = path.join(__dirname, 'miniprogram', 'app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    
    const envMatch = appJsContent.match(/env:\s*['"]([^'"]+)['"]/);
    if (envMatch) {
      console.log('✅ app.js 云环境配置:', envMatch[1]);
      return envMatch[1];
    } else {
      console.log('❌ 未找到 app.js 中的云环境配置');
      return null;
    }
  } catch (error) {
    console.error('读取 app.js 失败:', error);
    return null;
  }
}

// 读取 imageManager.js 中的云存储路径
function checkImageManager() {
  try {
    const imageManagerPath = path.join(__dirname, 'miniprogram', 'utils', 'imageManager.js');
    const imageManagerContent = fs.readFileSync(imageManagerPath, 'utf8');
    
    const cloudPathMatch = imageManagerContent.match(/cloud:\/\/([^\/]+)/);
    if (cloudPathMatch) {
      console.log('✅ imageManager.js 云存储路径:', cloudPathMatch[0]);
      return cloudPathMatch[1];
    } else {
      console.log('❌ 未找到 imageManager.js 中的云存储路径');
      return null;
    }
  } catch (error) {
    console.error('读取 imageManager.js 失败:', error);
    return null;
  }
}

// 检查云函数配置
function checkCloudFunctions() {
  try {
    const cloudFunctionsPath = path.join(__dirname, 'cloudfunctions');
    const functions = fs.readdirSync(cloudFunctionsPath);
    
    console.log('✅ 云函数列表:', functions);
    
    // 检查 uploadImages 云函数
    const uploadImagesPath = path.join(cloudFunctionsPath, 'uploadImages');
    if (fs.existsSync(uploadImagesPath)) {
      console.log('✅ uploadImages 云函数存在');
      
      const indexJsPath = path.join(uploadImagesPath, 'index.js');
      if (fs.existsSync(indexJsPath)) {
        console.log('✅ uploadImages/index.js 存在');
      } else {
        console.log('❌ uploadImages/index.js 不存在');
      }
      
      const packageJsonPath = path.join(uploadImagesPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        console.log('✅ uploadImages/package.json 存在');
      } else {
        console.log('❌ uploadImages/package.json 不存在');
      }
    } else {
      console.log('❌ uploadImages 云函数不存在');
    }
  } catch (error) {
    console.error('检查云函数失败:', error);
  }
}

// 运行检查
console.log('=== 云环境配置检查 ===');
const appEnv = checkAppConfig();
const imageManagerEnv = checkImageManager();
checkCloudFunctions();

console.log('\n=== 检查结果 ===');
if (appEnv && imageManagerEnv) {
  console.log('云环境配置已找到');
  console.log('app.js 环境:', appEnv);
  console.log('imageManager.js 环境:', imageManagerEnv);
  
  if (imageManagerEnv.includes(appEnv)) {
    console.log('✅ 环境配置一致');
  } else {
    console.log('❌ 环境配置不一致，需要修正');
  }
} else {
  console.log('❌ 环境配置不完整');
}
