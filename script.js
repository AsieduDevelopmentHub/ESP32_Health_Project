// Generate time labels for 24 hours
function generateTimeLabels() {
    const labels = [];
    const now = new Date();
    for (let hour = 0; hour < 24; hour++) {
        const time = new Date(now);
        time.setHours(hour);
        labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
}

// Generate random data for demonstration
function generateRandomData(min, max, count) {
    return Array.from({ length: count }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    document.getElementById('currentTime').textContent = timeString;
}

// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
    // Notification popup functionality
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPopup = document.querySelector('.notification-popup');
    const closeNotifications = document.querySelector('.close-notifications');

    // Toggle notification popup
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationPopup.classList.toggle('active');
    });

    // Close notification popup when clicking close button
    closeNotifications.addEventListener('click', function() {
        notificationPopup.classList.remove('active');
    });

    // Close notification popup when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationPopup.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPopup.classList.remove('active');
        }
    });

    // Prevent closing when clicking inside popup
    notificationPopup.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Profile button functionality
    const profileBtn = document.querySelector('.profile-btn');
    
    profileBtn.addEventListener('click', function() {
        window.location.href = 'auth.html';
    });

    // Initialize Charts
    const timeLabels = generateTimeLabels();
    const dataPoints = timeLabels.length;

    // Update time display every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Health Trends Chart (24-hour monitoring)
    const healthTrendsCtx = document.getElementById('healthTrendsChart').getContext('2d');
    new Chart(healthTrendsCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Heart Rate (bpm)',
                data: generateRandomData(70, 80, dataPoints),
                borderColor: '#e91e63',
                tension: 0.4,
                fill: false,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: 'Blood Pressure (mmHg)',
                data: generateRandomData(120, 140, dataPoints),
                borderColor: '#2196f3',
                tension: 0.4,
                fill: false,
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 10
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 24,
                        padding: 5
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Heart Rate (bpm)'
                    },
                    min: 0,
                    max: 200,
                    ticks: {
                        stepSize: 20,
                        padding: 5,
                        callback: function(value) {
                            return value + ' bpm';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Blood Pressure (mmHg)'
                    },
                    min: 0,
                    max: 200,
                    ticks: {
                        stepSize: 20,
                        padding: 5,
                        callback: function(value) {
                            return value + ' mmHg';
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Vital Signs Distribution Chart
    const vitalSignsCtx = document.getElementById('vitalSignsChart').getContext('2d');
    new Chart(vitalSignsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Normal', 'Elevated', 'Critical'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Add event listeners for chart buttons
    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            chartButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            console.log(`Selected time period: ${this.textContent}`);
        });
    });
}); 