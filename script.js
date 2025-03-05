// 运势描述数组
const fortunes = {
    overall: ['大吉', '吉', '中吉', '小吉', '平', '小凶', '凶'],
    love: ['桃花运旺盛', '感情稳定', '有新的机遇', '需要多关心对方', '暂时保持现状', '注意沟通', '暂时不宜恋爱'],
    career: ['事业蒸蒸日上', '工作顺利', '有新的机会', '需要努力', '保持现状', '注意细节', '暂时不宜变动'],
    wealth: ['财运亨通', '收入稳定', '有意外收获', '收支平衡', '需要节约', '注意理财', '暂时不宜投资'],
    health: ['精力充沛', '身体状况良好', '注意作息', '需要休息', '保持运动', '注意饮食', '及时就医']
};

// 获取DOM元素
const birthdayInput = document.getElementById('birthday');
const saveButton = document.getElementById('saveBirthday');
const generateButton = document.getElementById('generateFortune');
const shareButton = document.getElementById('shareButton');
const fortuneSound = document.getElementById('fortuneSound');
const fortuneCard = document.getElementById('fortuneCard');
const fortuneElements = {
    overall: document.getElementById('overall'),
    love: document.getElementById('love'),
    career: document.getElementById('career'),
    wealth: document.getElementById('wealth'),
    health: document.getElementById('health')
};

// 撒花特效函数
function triggerConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// 播放音效
function playFortuneSound() {
    fortuneSound.currentTime = 0;
    fortuneSound.volume = 0.5;
    fortuneSound.play().catch(error => {
        console.log('音效播放失败:', error);
    });
}

// 从localStorage加载生日
function loadBirthday() {
    const savedBirthday = localStorage.getItem('birthday');
    if (savedBirthday) {
        birthdayInput.value = savedBirthday;
    }
}

// 保存生日到localStorage
function saveBirthday() {
    const birthday = birthdayInput.value;
    if (birthday) {
        localStorage.setItem('birthday', birthday);
        alert('生日保存成功！');
    }
}

// 计算运势
function calculateFortune(birthday) {
    if (!birthday) {
        alert('请先输入并保存您的生日！');
        return;
    }

    // 使用生日和当前日期生成一个唯一的种子
    const today = new Date();
    const seed = birthday + today.getFullYear() + (today.getMonth() + 1) + today.getDate();
    
    // 为每个运势类别生成一个随机数
    Object.keys(fortuneElements).forEach(category => {
        const randomIndex = Math.abs(hashCode(seed + category)) % fortunes[category].length;
        fortuneElements[category].textContent = fortunes[category][randomIndex];
        
        // 根据运势设置不同的颜色
        const colors = ['#2ecc71', '#27ae60', '#3498db', '#2980b9', '#95a5a6', '#e67e22', '#e74c3c'];
        fortuneElements[category].style.color = colors[randomIndex];
    });

    // 触发特效
    triggerConfetti();
    playFortuneSound();
    
    // 显示分享按钮
    shareButton.style.display = 'block';
}

// 生成分享图片
async function generateShareImage() {
    try {
        // 创建临时容器
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.background = 'white';
        tempContainer.style.padding = '20px';
        tempContainer.style.width = '600px';
        document.body.appendChild(tempContainer);

        // 克隆运势卡片
        const cardClone = fortuneCard.cloneNode(true);
        tempContainer.appendChild(cardClone);

        // 使用html2canvas生成图片
        const canvas = await html2canvas(cardClone, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });

        // 创建下载链接
        const link = document.createElement('a');
        link.download = `运势预测_${new Date().toLocaleDateString()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 清理临时元素
        document.body.removeChild(tempContainer);
    } catch (error) {
        console.error('生成图片失败:', error);
        alert('生成图片失败，请稍后重试');
    }
}

// 简单的哈希函数
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

// 事件监听
saveButton.addEventListener('click', saveBirthday);
generateButton.addEventListener('click', () => {
    calculateFortune(birthdayInput.value);
});
shareButton.addEventListener('click', generateShareImage);

// 页面加载时初始化
loadBirthday(); 