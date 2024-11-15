const apiEndpoint = 'http://127.0.0.1:5000/predict_traffic';

document.addEventListener('DOMContentLoaded', () => {
    if (!window.dataFetched) {  
        console.log("Initializing data fetch..."); // Log when fetchData is triggered
        window.dataFetched = true;
        fetchData();
    }
});

function fetchData() {
    console.log("Fetching data..."); // Log each fetch attempt to debug

    const requestData = {
        user_id: '1234567899',  // Replace with your test user ID
        timestamp: '2024-11-9 13:30:00'  // Replace with a test timestamp
    };

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        displayData(data);
        renderChart(data.avg_slot_info);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayData(data) {
    document.getElementById('user-id').innerText = data.id;
    document.getElementById('date').innerText = new Date().toLocaleDateString();
    document.getElementById('day').innerText = data.day;
    document.getElementById('slot-no').innerText = data["slot_no."];
    document.getElementById('traffic-message').innerText = data.traffic_message;
}

function renderChart(avgSlotInfo) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    const slotNumbers = avgSlotInfo.map(info => info['slot_no.']);
    const avgBookedSlots = avgSlotInfo.map(info => info['avg_booked_slots']);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: slotNumbers,
            datasets: [{
                label: 'Traffic on scale of 10',
                data: avgBookedSlots,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Slot No.'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Traffic on scale of 10'
                    }
                }
            }
        }
    });
}
