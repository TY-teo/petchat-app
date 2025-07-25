// DOM元素获取
const navItems = document.querySelectorAll('.nav-item');
const pageContents = document.querySelectorAll('.page-content');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const voiceToggleBtn = document.getElementById('voice-toggle-btn');
const voiceInputArea = document.getElementById('voice-input-area');
const voiceRecordBtn = document.getElementById('voice-record-btn');
const voiceInputContainer = document.getElementById('voice-input-container');
const voiceCancelArea = document.getElementById('voice-cancel-area');
const currentTimeElement = document.getElementById('current-time');
const postBtn = document.getElementById('post-btn');

// 上下文菜单和反馈弹窗元素
const contextMenu = document.getElementById('message-context-menu');
const copyMessageBtn = document.getElementById('copy-message');
const feedbackMessageBtn = document.getElementById('feedback-message');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackTextarea = document.getElementById('feedback-textarea');
const feedbackCancelBtn = document.getElementById('feedback-cancel');
const feedbackSubmitBtn = document.getElementById('feedback-submit');

// 宠物回复库
const petReplies = [
    '汪汪！我很想你呢~',
    '主人，我刚才在想你！',
    '今天天气真好，想和你一起玩~',
    '我刚才看到一只小鸟，好想和你分享！',
    '主人你回来了吗？我一直在等你~',
    '汪汪汪！我好开心！',
    '我想和你一起散步~',
    '主人，你今天过得怎么样？',
    '我刚才睡了个好觉，梦到你了~',
    '汪！有好吃的吗？'
];

// 初始化应用
function initApp() {
    // 更新时间
    updateTime();
    setInterval(updateTime, 1000);
    
    // 绑定导航事件
    bindNavigationEvents();
    
    // 绑定聊天事件
    bindChatEvents();
    
    // 绑定其他交互事件
    bindInteractionEvents();
    
    // 模拟宠物在线状态更新
    simulatePetStatus();
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}`;
}

// 绑定导航事件
function bindNavigationEvents() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');
            switchPage(targetPage);
            
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// 页面切换功能
function switchPage(targetPageId) {
    pageContents.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// 绑定聊天事件
function bindChatEvents() {
    // 发送按钮点击事件
    sendBtn.addEventListener('click', sendMessage);
    
    // 输入框回车事件
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 语音切换按钮事件
    voiceToggleBtn.addEventListener('click', toggleVoiceInput);
    
    // 语音录制按钮事件
    voiceRecordBtn.addEventListener('mousedown', startRecording);
    voiceRecordBtn.addEventListener('mouseup', stopRecording);
    voiceRecordBtn.addEventListener('mouseleave', stopRecording);
    
    // 触摸设备支持
    voiceRecordBtn.addEventListener('touchstart', startRecording);
    voiceRecordBtn.addEventListener('touchend', stopRecording);
    
    // 点击背景关闭语音界面
    voiceInputArea.addEventListener('click', (e) => {
        if (e.target === voiceInputArea) {
            hideVoiceInput();
        }
    });
    
    // 阻止语音界面的长按事件传播
    voiceInputArea.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
    voiceInputArea.addEventListener('touchend', (e) => {
        e.stopPropagation();
    });
}

// 发送消息功能
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, 'user');
    
    // 清空输入框
    messageInput.value = '';
    
    // 模拟宠物回复（延迟1-3秒）
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
        const petReply = getPetReply(message);
        addMessage(petReply, 'pet');
    }, delay);
}

// 添加消息到聊天界面
function addMessage(text, sender, isVoice = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'pet' ? '🐕' : '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (sender === 'pet') {
        // 宠物消息：语音 + 翻译
        const voiceMessage = document.createElement('div');
        voiceMessage.className = 'pet-voice-message';
        voiceMessage.innerHTML = `
            <div class="voice-wave">
                <span></span><span></span><span></span><span></span><span></span>
            </div>
            <span class="voice-duration">${Math.floor(Math.random() * 5) + 2}"</span>
            <button class="voice-play-btn">
                <i class="fas fa-play"></i>
            </button>
        `;
        
        const translationBox = document.createElement('div');
        translationBox.className = 'translation-box';
        translationBox.innerHTML = `
            <div class="translation-text">${text}</div>
            <div class="translation-feedback">
                <button class="feedback-btn thumbs-up">
                    <i class="far fa-thumbs-up"></i>
                </button>
                <button class="feedback-btn thumbs-down">
                    <i class="far fa-thumbs-down"></i>
                </button>
            </div>
        `;
        
        content.appendChild(voiceMessage);
        content.appendChild(translationBox);
        
        // 绑定语音播放事件
        const playBtn = voiceMessage.querySelector('.voice-play-btn');
        playBtn.addEventListener('click', playPetVoice);
        
        // 绑定反馈事件
        const feedbackBtns = translationBox.querySelectorAll('.feedback-btn');
        feedbackBtns.forEach(btn => {
            btn.addEventListener('click', handleTranslationFeedback);
        });
        
    } else if (isVoice) {
        // 用户语音消息
        const voiceMessage = document.createElement('div');
        voiceMessage.className = 'user-voice-message';
        voiceMessage.innerHTML = `
            <div class="voice-bubble">
                <i class="fas fa-microphone"></i>
                <span>${Math.floor(Math.random() * 3) + 1}"</span>
            </div>
        `;
        content.appendChild(voiceMessage);
    } else {
        // 普通文字消息
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = text;
        content.appendChild(messageText);
    }
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = '刚刚';
    content.appendChild(messageTime);
    
    if (sender === 'pet') {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
    } else {
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // 为消息添加长按事件
    addMessageLongPress(messageDiv, sender);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 添加动画效果
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

// 获取宠物回复
function getPetReply(userMessage) {
    // 简单的关键词匹配
    const message = userMessage.toLowerCase();
    
    if (message.includes('你好') || message.includes('hi')) {
        return '汪汪！主人好~';
    } else if (message.includes('吃') || message.includes('食物')) {
        return '汪汪！我想吃好吃的！';
    } else if (message.includes('玩') || message.includes('游戏')) {
        return '太好了！我们一起玩吧~';
    } else if (message.includes('乖') || message.includes('好狗')) {
        return '汪汪~我最乖了！';
    } else if (message.includes('散步') || message.includes('出去')) {
        return '太棒了！我们去散步吧！';
    } else if (message.includes('累') || message.includes('休息')) {
        return '那我们一起休息吧~';
    } else {
        // 随机回复
        return petReplies[Math.floor(Math.random() * petReplies.length)];
    }
}

// 语音相关变量
let isRecording = false;
let recordingTimer = null;
let startY = 0;
let currentY = 0;
let isDragUp = false;

// 消息上下文菜单相关变量
let currentMessage = null;
let longPressTimer = null;

// 切换语音输入界面
function toggleVoiceInput() {
    if (voiceInputArea.style.display === 'none') {
        showVoiceInput();
    } else {
        hideVoiceInput();
    }
}

// 显示语音输入界面
function showVoiceInput() {
    voiceInputArea.style.display = 'flex';
    // 禁用消息长按事件
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    setTimeout(() => {
        voiceInputArea.style.opacity = '1';
    }, 10);
}

// 隐藏语音输入界面
function hideVoiceInput() {
    voiceInputArea.style.opacity = '0';
    // 恢复消息长按事件
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    setTimeout(() => {
        voiceInputArea.style.display = 'none';
    }, 300);
}

// 开始录音
function startRecording(e) {
    e.preventDefault();
    if (isRecording) return;
    
    isRecording = true;
    isDragUp = false;
    voiceRecordBtn.classList.add('recording');
    
    // 记录起始位置
    if (e.type === 'touchstart' && e.touches) {
        startY = e.touches[0].clientY;
        currentY = startY;
    } else {
        startY = e.clientY;
        currentY = startY;
    }
    
    // 模拟录音过程
    recordingTimer = setTimeout(() => {
        if (isRecording) {
            stopRecording();
        }
    }, 60000); // 最长60秒
    
    // 更新提示文字
    document.querySelector('.voice-tip').textContent = '正在录音...';
    document.querySelector('.voice-cancel-tip').textContent = '松开发送，上滑取消';
    
    // 绑定移动事件，只在录音按钮区域内阻止默认行为
    voiceRecordBtn.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
}

// 处理触摸移动
function handleTouchMove(e) {
    if (!isRecording) return;
    e.preventDefault();
    
    if (e.touches && e.touches.length > 0) {
        currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        // 降低触发阈值，提高敏感度
        if (deltaY > 30) {
            // 上滑超过30px，显示取消状态
            if (!isDragUp) {
                isDragUp = true;
                voiceInputArea.classList.add('drag-up');
                const cancelArea = document.querySelector('.voice-cancel-area');
                if (cancelArea) cancelArea.classList.add('show');
                document.querySelector('.voice-tip').textContent = '松开取消';
                
                // 震动反馈
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        } else {
            // 取消上滑状态
            if (isDragUp) {
                isDragUp = false;
                voiceInputArea.classList.remove('drag-up');
                const cancelArea = document.querySelector('.voice-cancel-area');
                if (cancelArea) cancelArea.classList.remove('show');
                document.querySelector('.voice-tip').textContent = '正在录音...';
            }
        }
    }
}

// 处理鼠标移动
function handleMouseMove(e) {
    if (!isRecording) return;
    
    currentY = e.clientY;
    const deltaY = startY - currentY;
    
    // 降低触发阈值，提高敏感度
    if (deltaY > 30) {
        if (!isDragUp) {
            isDragUp = true;
            voiceInputArea.classList.add('drag-up');
            const cancelArea = document.querySelector('.voice-cancel-area');
            if (cancelArea) cancelArea.classList.add('show');
            document.querySelector('.voice-tip').textContent = '松开取消';
        }
    } else {
        if (isDragUp) {
            isDragUp = false;
            voiceInputArea.classList.remove('drag-up');
            const cancelArea = document.querySelector('.voice-cancel-area');
            if (cancelArea) cancelArea.classList.remove('show');
            document.querySelector('.voice-tip').textContent = '正在录音...';
        }
    }
}

// 停止录音
function stopRecording(e) {
    if (!isRecording) return;
    
    isRecording = false;
    voiceRecordBtn.classList.remove('recording');
    voiceInputContainer.classList.remove('drag-up');
    voiceCancelArea.classList.remove('show');
    
    // 移除事件监听
    voiceRecordBtn.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('mousemove', handleMouseMove);
    
    if (recordingTimer) {
        clearTimeout(recordingTimer);
        recordingTimer = null;
    }
    
    // 恢复提示文字
    document.querySelector('.voice-tip').textContent = '按住说话';
    document.querySelector('.voice-cancel-tip').textContent = '上滑取消';
    
    if (isDragUp) {
        // 如果是上滑取消，直接关闭界面
        hideVoiceInput();
        showToast('已取消录音');
    } else {
        // 正常发送语音消息
        setTimeout(() => {
            addMessage('', 'user', true); // 用户语音消息
            hideVoiceInput();
            
            // 模拟宠物回复
            setTimeout(() => {
                const petReply = getPetReply('语音消息');
                addMessage(petReply, 'pet');
            }, 1500);
        }, 300);
    }
}

// 播放宠物语音
function playPetVoice(e) {
    const button = e.target.closest('.voice-play-btn');
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('fa-play')) {
        // 开始播放
        icon.className = 'fas fa-pause';
        button.style.background = '#4caf50';
        
        // 模拟播放完成
        setTimeout(() => {
            icon.className = 'fas fa-play';
            button.style.background = '#ff6b9d';
        }, 2000);
    } else {
        // 停止播放
        icon.className = 'fas fa-play';
        button.style.background = '#ff6b9d';
    }
}

// 处理翻译反馈
function handleTranslationFeedback(e) {
    const button = e.target.closest('.feedback-btn');
    const isThumbsUp = button.classList.contains('thumbs-up');
    const feedbackContainer = button.parentElement;
    
    // 清除其他按钮的激活状态
    feedbackContainer.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 激活当前按钮
    button.classList.add('active');
    
    // 显示反馈提示
    const feedbackText = isThumbsUp ? '感谢您的肯定！' : '我们会改进翻译准确性';
    showToast(feedbackText);
}

// 添加消息长按事件
function addMessageLongPress(messageElement, sender) {
    let pressTimer = null;
    let isLongPressed = false;
    let startTime = 0;
    let touchMoved = false;
    
    // 鼠标/触摸开始
    const startLongPress = (e) => {
        // 只在消息内容区域触发，不在头像或空白区域触发
        const messageContent = messageElement.querySelector('.message-content');
        const target = e.target;
        
        // 检查点击目标是否在消息内容区域内
        if (!messageContent || !messageContent.contains(target)) {
            return;
        }
        
        isLongPressed = false;
        touchMoved = false;
        startTime = Date.now();
        
        // 防止文本选择和默认行为
        e.preventDefault();
        e.stopPropagation();
        
        pressTimer = setTimeout(() => {
            isLongPressed = true;
            showContextMenu(e, messageElement, sender);
        }, 500); // 500ms长按
    };
    
    // 处理移动事件，如果移动太多则取消长按
    const handleMove = (e) => {
        if (!touchMoved) {
            const touch = e.touches ? e.touches[0] : e;
            const startTouch = e.touches ? e.changedTouches[0] : e;
            if (Math.abs(touch.clientX - startTouch.clientX) > 10 || 
                Math.abs(touch.clientY - startTouch.clientY) > 10) {
                touchMoved = true;
                endLongPress();
            }
        }
    };
    
    // 鼠标/触摸结束
    const endLongPress = (e) => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
        
        // 如果长按菜单已显示且时间很短，延迟隐藏以防止立即消失
        if (isLongPressed && e && Date.now() - startTime < 600) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    };
    
    // 绑定事件
    messageElement.addEventListener('mousedown', startLongPress);
    messageElement.addEventListener('mouseup', endLongPress);
    messageElement.addEventListener('mouseleave', endLongPress);
    messageElement.addEventListener('touchstart', startLongPress, { passive: false });
    messageElement.addEventListener('touchend', endLongPress, { passive: false });
    messageElement.addEventListener('touchcancel', endLongPress);
    messageElement.addEventListener('touchmove', handleMove, { passive: false });
    messageElement.addEventListener('mousemove', handleMove);
}

// 显示上下文菜单
function showContextMenu(e, messageElement, sender) {
    currentMessage = messageElement;
    
    // 获取消息文本
    let messageText = '';
    if (sender === 'pet') {
        const translationElement = messageElement.querySelector('.translation-text');
        messageText = translationElement ? translationElement.textContent : '';
        feedbackMessageBtn.style.display = 'block';
    } else {
        const textElement = messageElement.querySelector('.message-text');
        messageText = textElement ? textElement.textContent : '语音消息';
        feedbackMessageBtn.style.display = 'none';
    }
    
    // 存储消息文本用于复制
    contextMenu.dataset.messageText = messageText;
    
    // 计算菜单位置
    let x, y;
    if (e.type === 'touchstart' || e.touches) {
        const touch = e.touches ? e.touches[0] : e.changedTouches[0];
        x = touch.clientX;
        y = touch.clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    
    // 确保菜单不超出屏幕
    const menuWidth = 150;
    const menuHeight = sender === 'pet' ? 100 : 60;
    
    if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
        y = y - menuHeight - 10;
    }
    
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.classList.add('show');
    
    // 延迟添加全局点击事件，防止立即触发
    setTimeout(() => {
        document.addEventListener('click', hideContextMenu);
        document.addEventListener('touchstart', hideContextMenu);
    }, 300);
}

// 隐藏上下文菜单
function hideContextMenu(e) {
    // 如果点击的是菜单内部，不隐藏
    if (e && contextMenu.contains(e.target)) {
        return;
    }
    
    contextMenu.classList.remove('show');
    document.removeEventListener('click', hideContextMenu);
    document.removeEventListener('touchstart', hideContextMenu);
}

// 复制消息
function copyMessage() {
    const messageText = contextMenu.dataset.messageText;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(messageText).then(() => {
            showToast('已复制到剪贴板');
        });
    } else {
        // 兼容旧浏览器
        const textArea = document.createElement('textarea');
        textArea.value = messageText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('已复制到剪贴板');
    }
    hideContextMenu();
}

// 显示反馈弹窗
function showFeedbackModal() {
    feedbackModal.classList.add('show');
    feedbackTextarea.focus();
    hideContextMenu();
}

// 隐藏反馈弹窗
function hideFeedbackModal() {
    feedbackModal.classList.remove('show');
    feedbackTextarea.value = '';
}

// 提交反馈
function submitFeedback() {
    const feedbackText = feedbackTextarea.value.trim();
    if (!feedbackText) {
        showToast('请输入反馈内容');
        return;
    }
    
    // 模拟提交反馈
    showToast('反馈已提交，感谢您的建议！');
    hideFeedbackModal();
}

// 绑定其他交互事件
function bindInteractionEvents() {
    // 发布动态按钮
    if (postBtn) {
        postBtn.addEventListener('click', () => {
            showToast('发布动态功能开发中...');
        });
    }
    
    // 动态交互按钮
    const likeBtns = document.querySelectorAll('.like-btn');
    const commentBtns = document.querySelectorAll('.comment-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    
    likeBtns.forEach(btn => {
        btn.addEventListener('click', handleLikeAction);
    });
    
    commentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('评论功能开发中...');
        });
    });
    
    shareBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('分享功能开发中...');
        });
    });
    
    // 上下文菜单按钮
    copyMessageBtn.addEventListener('click', copyMessage);
    feedbackMessageBtn.addEventListener('click', showFeedbackModal);
    
    // 反馈弹窗按钮
    feedbackCancelBtn.addEventListener('click', hideFeedbackModal);
    feedbackSubmitBtn.addEventListener('click', submitFeedback);
    
    // 点击弹窗背景关闭
    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            hideFeedbackModal();
        }
    });
    
    // 宠物功能按钮
    const functionBtns = document.querySelectorAll('.function-btn');
    functionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const functionType = btn.getAttribute('data-function');
            handlePetFunction(functionType);
        });
    });
    
    // 电子围栏开关事件
    const fenceSwitches = document.querySelectorAll('.fence-item input[type="checkbox"]');
    fenceSwitches.forEach(switchBtn => {
        switchBtn.addEventListener('change', (e) => {
            const fenceName = e.target.closest('.fence-item').querySelector('.fence-name').textContent;
            const isEnabled = e.target.checked;
            showToast(`${fenceName}围栏已${isEnabled ? '开启' : '关闭'}`);
        });
    });
    
    // 添加新围栏按钮
    const addFenceBtn = document.querySelector('.add-fence-btn');
    if (addFenceBtn) {
        addFenceBtn.addEventListener('click', () => {
            showToast('添加电子围栏功能开发中...');
        });
    }
    
    // 模拟健康数据变化
    simulateHealthData();
}

// 处理宠物功能点击
function handlePetFunction(functionType) {
    const functionNames = {
        'edit-profile': '编辑宠物资料',
        'pet-album': '宠物相册',
        'growth-record': '成长记录',
        'medical-record': '病历档案',
        'feeding-plan': '喂食计划管理',
        'exercise-plan': '运动计划设置',
        'grooming': '美容护理记录',
        'vaccine-schedule': '疫苗接种计划',
        'device-settings': '设备参数配置',
        'device-status': '连接状态检测',
        'voice-training': '语音识别训练',
        'firmware-update': '固件版本更新',
        'behavior-analysis': '行为模式分析',
        'emotion-report': '情绪状态报告',
        'health-report': '健康数据报告',
        'activity-report': '运动数据统计',
        'emergency-contact': '紧急联系人设置',
        'insurance': '宠物保险管理',
        'notifications': '消息通知设置',
        'backup': '云端数据备份'
    };
    
    const functionName = functionNames[functionType] || '未知功能';
    
    // 处理编辑资料功能
    if (functionType === 'edit-profile') {
        showEditProfileModal();
        return;
    }
    
    // 处理成长记录功能
    if (functionType === 'growth-record') {
        showGrowthRecordPage();
        return;
    }
    
    showToast(`正在打开${functionName}...`);
    
    // 这里可以根据不同功能跳转到对应页面
    // 例如：window.location.href = `/pet/${functionType}`;
}

// 显示编辑资料弹窗
function showEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('show');
    
    // 绑定关闭按钮事件
    const closeBtn = document.getElementById('edit-profile-close');
    const cancelBtn = document.getElementById('edit-profile-cancel');
    const submitBtn = document.getElementById('edit-profile-submit');
    
    closeBtn.onclick = hideEditProfileModal;
    cancelBtn.onclick = hideEditProfileModal;
    submitBtn.onclick = saveProfileChanges;
    
    // 点击背景关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            hideEditProfileModal();
        }
    };
}

// 隐藏编辑资料弹窗
function hideEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.remove('show');
}

// 保存资料修改
function saveProfileChanges() {
    // 获取表单数据
    const petName = document.getElementById('pet-name-input').value.trim();
    const petBreed = document.getElementById('pet-breed-input').value.trim();
    const petAge = document.getElementById('pet-age-input').value;
    const petHeight = document.getElementById('pet-height-input').value;
    const petWeight = document.getElementById('pet-weight-input').value;
    const petBirth = document.getElementById('pet-birth-input').value;
    const petGender = document.querySelector('input[name="pet-gender"]:checked').value;
    
    // 验证必填项
    if (!petName) {
        showToast('请输入宠物名称');
        return;
    }
    
    // 更新页面显示
    const petNameElement = document.querySelector('.pet-details h2');
    const petBreedElement = document.querySelector('.pet-breed');
    const heightElement = document.querySelector('.basic-info-item:nth-child(1) .info-value');
    const weightElement = document.querySelector('.basic-info-item:nth-child(2) .info-value');
    const birthElement = document.querySelector('.basic-info-item:nth-child(3) .info-value');
    
    if (petNameElement) petNameElement.textContent = petName;
    if (petBreedElement) petBreedElement.textContent = `${petBreed} • ${petAge}岁`;
    if (heightElement) heightElement.textContent = `${petHeight}cm`;
    if (weightElement) weightElement.textContent = `${petWeight}kg`;
    if (birthElement) birthElement.textContent = petBirth;
    
    // 关闭弹窗
    hideEditProfileModal();
    showToast('资料已更新');
}

// 显示成长记录页面
function showGrowthRecordPage() {
    const growthPage = document.getElementById('growth-record-page');
    growthPage.classList.add('show');
    
    // 绑定返回按钮
    const backBtn = document.getElementById('growth-back-btn');
    backBtn.onclick = hideGrowthRecordPage;
    
    // 绑定添加记录按钮
    const addBtn = document.getElementById('add-record-btn');
    addBtn.onclick = () => {
        showToast('添加成长记录功能开发中...');
    };
}

// 隐藏成长记录页面
function hideGrowthRecordPage() {
    const growthPage = document.getElementById('growth-record-page');
    growthPage.classList.remove('show');
}

// 处理点赞操作
function handleLikeAction(e) {
    const button = e.target.closest('.like-btn');
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('span');
    const currentCount = parseInt(countSpan.textContent);
    
    if (button.classList.contains('liked')) {
        // 取消点赞
        button.classList.remove('liked');
        icon.className = 'far fa-heart';
        countSpan.textContent = currentCount - 1;
    } else {
        // 点赞
        button.classList.add('liked');
        icon.className = 'fas fa-heart';
        countSpan.textContent = currentCount + 1;
        
        // 点赞动画效果
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
}

// 显示提示消息
function showToast(message) {
    // 创建提示框
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 3秒后移除
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 模拟宠物状态更新
function simulatePetStatus() {
    setInterval(() => {
        // 随机更新宠物心情
        const moods = [
            { emoji: '😊', text: '开心', class: 'happy' },
            { emoji: '😴', text: '困倦', class: 'sleepy' },
            { emoji: '🤗', text: '兴奋', class: 'excited' },
            { emoji: '😋', text: '饿了', class: 'hungry' }
        ];
        
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const moodElement = document.querySelector('.mood-value');
        if (moodElement) {
            moodElement.textContent = `${randomMood.emoji} ${randomMood.text}`;
            moodElement.className = `mood-value ${randomMood.class}`;
        }
        
        // 随机发送宠物消息（低概率）
        if (Math.random() < 0.1 && document.querySelector('#chat-page.active')) {
            const randomReply = petReplies[Math.floor(Math.random() * petReplies.length)];
            addMessage(randomReply, 'pet');
        }
    }, 30000); // 每30秒更新一次
}

// 模拟健康数据变化
function simulateHealthData() {
    setInterval(() => {
        const healthBars = document.querySelectorAll('.health-progress');
        healthBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            const change = Math.random() * 10 - 5; // -5 到 +5 的变化
            let newWidth = Math.max(0, Math.min(100, currentWidth + change));
            bar.style.width = `${newWidth}%`;
            
            // 更新对应的数值显示
            const valueElement = bar.parentElement.parentElement.querySelector('.health-value');
            if (valueElement) {
                valueElement.textContent = `${Math.round(newWidth)}%`;
            }
        });
    }, 60000); // 每分钟更新一次
}

// 添加一些动画效果
function addAnimations() {
    // 页面加载动画
    const cards = document.querySelectorAll('.location-card, .stat-item, .pet-profile, .social-feed, .nearby-pets, .pet-health, .pet-care');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // 延迟添加动画效果
    setTimeout(addAnimations, 500);
    
    // 为已存在的消息添加长按事件
    document.querySelectorAll('.message').forEach(msg => {
        const isPetMessage = msg.classList.contains('pet-message');
        addMessageLongPress(msg, isPetMessage ? 'pet' : 'user');
    });
    
    // 添加欢迎消息
    setTimeout(() => {
        addMessage('主人，欢迎使用PetChat！我是你的宠物小白~', 'pet');
    }, 1000);
});

// 监听窗口大小变化，确保移动端适配
window.addEventListener('resize', () => {
    // 移动端视口高度处理
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 初始设置视口高度
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`); 