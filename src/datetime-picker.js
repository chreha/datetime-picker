//Luxon time minified        
const wol = window.onload;
window.onload = function(e) {
    if(typeof(wol) == "function") {
        wol();
    }            
    timezonePicker.init();
    document.querySelector('.show-datetime').addEventListener('click', function(e) {
        document.querySelector('.datetime-picker').classList.add('active');
    })
    document.querySelector('.datetime-picker-dismiss').addEventListener('click', function(e) {
        document.querySelector('.datetime-picker').classList.remove('active');
        setTimeout(() => {
            document.querySelector('.datetime-picker-form').style.display = "block";
            document.querySelector('.datetime-picker-form').reset();
            document.querySelector('.datetime-confirm-panel').classList.remove('active');  
            document.querySelector('.timezone-picker-blocktimes').innerHTML = "<p>Select a date above to be presented wtih available timeslots for that day.</p>";  
            let btn = document.querySelector('.datetime-picker-form [type=submit]'); btn.classList.remove('active'); btn.disabled=true;
        }, 500);
        
    })
}
let timezonePicker = {
    timezone: "CST",
    timezoneCode: "America/North_Dakota/Center",
    blocktime: {hours:1},
    maxDaysOut: {days:14},
    currDaysOut: 0,
    startTime: null,
    endTime: null,
    leadOut: {hours:1},
    startAt: {hours:8, minute:0},
    endAt: {hour:17, minute:30},
    formSubmit: (e) => {
        e.preventDefault();
        let selectedDateInput = document.querySelector("[name=timezone-picker-date]:checked");
        let selectedTimeInput = document.querySelector("[name=timezone-picker-blocktime]:checked");                
        let local = luxon.DateTime.local();
        let time = selectedTimeInput.time;
        time = time.set({month: selectedDateInput.date.month, day: selectedDateInput.date.day});
        
        document.querySelector('.datetime-picker-form').style.display = "none";
        document.querySelector('.datetime-confirm-panel').innerHTML = "<h2>Your Demo Request was received.</h2>";
        if(local.zoneName != time.zoneName) {
            document.querySelector('.datetime-confirm-panel').innerHTML += "<p>We operate in the " + timezonePicker.timezone + " Time Zone. You selected to receive a call on " + time.monthLong + " " + time.day + " at " + time.toLocaleString(luxon.DateTime.TIME_SIMPLE) + " " + timezonePicker.timezone + "</p>";
            time = time.setZone(local.zoneName);
            document.querySelector('.datetime-confirm-panel').innerHTML += "<p>You can expect a call at " + time.toLocaleString(luxon.DateTime.TIME_SIMPLE) + " on " + time.monthLong + " " + time.day + " in your Time zone. We appreciate your interest in our product.</p>";
        } else {
            document.querySelector('.datetime-confirm-panel').innerHTML += "<p>You can expect a call at " + time.toLocaleString(luxon.DateTime.TIME_SIMPLE) + " on " + time.monthLong + " " + time.day + ". We appreciate your interest in our product.</p>";
        }
        
        document.querySelector('.datetime-confirm-panel').classList.add('active');
        return false;
    },
    buttonClick: function(e) {
        let directionValue = parseInt(this.getAttribute('data-rotate-timezone-picker-date'));
        timezonePicker.currDaysOut += directionValue;
        let containerWidth = document.querySelector('.timezone-picker-dates-container').clientWidth;
        let datesShown = Math.ceil(containerWidth / 65);
        let amtToTranslate = timezonePicker.currDaysOut * 65;
        if(timezonePicker.currDaysOut < (timezonePicker.maxDaysOut.days - datesShown)) {
            document.querySelector('.timezone-picker-dates button:last-child').disabled = false;            
        } else {
            document.querySelector('.timezone-picker-dates button:last-child').disabled = true;
            if(containerWidth % 65 != 0) {                
                amtToTranslate += containerWidth % 65;
            }
        }
        if(timezonePicker.currDaysOut > 0) {
            document.querySelector('.timezone-picker-dates button:first-child').disabled = false;
        } else {
            document.querySelector('.timezone-picker-dates button:first-child').disabled = true;
        }                        
        document.querySelectorAll('.timezone-picker-dates label').forEach((elem) => {
            elem.style.transform = "translateX(" + -1 * amtToTranslate + "px)";
        }); 
    },
    dateClicked: function(e) {
        //write the selectable time data
        if(!this.classList.contains('disabled')) {
            let btn = document.querySelector('.datetime-picker-form [type=submit]'); btn.classList.remove('active'); btn.disabled=true;
            
            let scrollHeight = document.querySelector('.datetime-picker-form').scrollHeight;
            document.querySelector('.datetime-picker-form').scrollTop = scrollHeight;

            let clickedDate = this.querySelector('input').date;                    
            this.querySelector('input').checked = true;                    
            let local = luxon.DateTime.local();
            let loopDate = local.setZone(timezonePicker.timezoneCode);
            loopDate = loopDate.set({minutes:0})
            if(local.day != clickedDate.day || local.hour <= timezonePicker.startAt.hours) {
                loopDate = loopDate.set(timezonePicker.startAt);                
            }  
            loopDate = loopDate.plus(timezonePicker.leadOut);
            let endLoopDate = timezonePicker.startTime;
            endLoopDate = endLoopDate.set(timezonePicker.endAt);
            timezonePicker.createTimeNodes(loopDate, endLoopDate);    
            e.preventDefault();            
        }
    },
    createTimeNodes: (loopDate, endLoopDate) => {
        let blocktimes = document.querySelector('.timezone-picker-blocktimes');
        blocktimes.innerHTML = "";
        let index = 1;
        
        if(loopDate.hour < timezonePicker.endAt.hour) {
            while(loopDate.diff(endLoopDate).toObject().milliseconds < 0) {
                let label = document.createElement('label');
                label.setAttribute('for', 'timezone-picker-block' + index);
                label.addEventListener('click', function(e) { let btn = document.querySelector('.datetime-picker-form [type=submit]'); btn.classList.add('active'); btn.disabled=false; })

                let inputElem = document.createElement('input');
                inputElem.type = 'radio';
                inputElem.id = 'timezone-picker-block' + index;
                inputElem.name = 'timezone-picker-blocktime';
                inputElem.required = true;
                inputElem.time = loopDate;

                let displayElem = document.createElement('span');
                displayElem.setAttribute('class', 'timezone-picker-blocktime-display');
                displayElem.innerText = loopDate.toLocaleString(luxon.DateTime.TIME_SIMPLE);

                label.append(inputElem);
                label.append(displayElem);                
                blocktimes.append(label);

                index++;
                loopDate = loopDate.plus(timezonePicker.blocktime);
            }
        } else {
            let label = document.createElement('label');
            label.setAttribute('for', 'timezone-picker-block' + index);

            let inputElem = document.createElement('input');
            inputElem.type = 'radio';
            inputElem.id = 'timezone-picker-block' + index;
            inputElem.name = 'timezone-picker-blocktime';
            inputElem.required = true;
            inputElem.disabled = true;
            inputElem.time = loopDate;

            let displayElem = document.createElement('span');
            displayElem.setAttribute('class', 'timezone-picker-blocktime-display');
            displayElem.innerHTML = "No available times for this date. <br/>Select a different date.";
            label.style.width = "350px";
            label.append(inputElem);
            label.append(displayElem);            
            blocktimes.append(label);
        }
        
    },
    createDateNode: (i, loopDate) => {                
        let inputElem = document.createElement('input');
        inputElem.type = 'radio';
        inputElem.id = 'timezone-picker-date' + i;
        inputElem.name = 'timezone-picker-date';                                                                                                                        
        inputElem.date = loopDate;
        inputElem.required = true;

        let label = document.createElement('label');
        label.setAttribute("for", 'timezone-picker-date' + i);        
        if(loopDate.weekday == 6 || loopDate.weekday == 7) {
            label.classList.add("disabled");
            inputElem.disabled = true;
        } else {
            label.setAttribute("tabindex", 1);
        }

        let headingElem = document.createElement('span');
        headingElem.setAttribute('class', 'timezone-picker-date-heading');
        headingElem.textContent = loopDate.weekdayLong.substring(0,3);

        let bodyElem = document.createElement('span');
        bodyElem.setAttribute('class', 'timezone-picker-date-body');
        bodyElem.innerHTML = loopDate.monthShort + '<strong>' + loopDate.day + '</strong>';                
        
        label.append(inputElem);
        label.append(headingElem);
        label.append(bodyElem);
        label.addEventListener('click', timezonePicker.dateClicked);
        label.addEventListener('keypress', timezonePicker.dateClicked);
        document.querySelector('.timezone-picker-dates-container').append(label);                
    },
    init: () => {                                                
        //create time set to local date at 8am convert to CST timezone and add the leadout offset to the time
        let local = luxon.DateTime.local();                
        timezonePicker.startTime = local.setZone(timezonePicker.timezoneCode);
        timezonePicker.startTime = timezonePicker.startTime.set(timezonePicker.startAt);                
        timezonePicker.startTime = timezonePicker.startTime.plus(timezonePicker.leadOut);
        
        //create time set to local date at 5:30pm convert to CST timezone and add the max range to the time
        local = luxon.DateTime.local();
        timezonePicker.endTime = local.setZone(timezonePicker.timezoneCode);                
        timezonePicker.endTime = timezonePicker.endTime.plus(timezonePicker.maxDaysOut);
        timezonePicker.endTime = timezonePicker.endTime.set(timezonePicker.endAt);

        //display the timezone to the user
        document.querySelector('.timezone-picker-timezone-display').setAttribute('data-timezone-abbreviation', timezonePicker.timezone);
        document.querySelector('.timezone-picker-blocktime').setAttribute('data-blocktime', timezonePicker.blocktime.hours + " Hour");

        //write the selectable date data              
        let loopDate = timezonePicker.startTime;  
        for(let i = 1; i < timezonePicker.maxDaysOut.days + 1; i++) {                    
            timezonePicker.createDateNode(i, loopDate);
            loopDate = loopDate.plus({days:1});
        }                               

        //setup buttons
        document.querySelectorAll('.timezone-picker-dates > button').forEach((elem) => {
            elem.addEventListener('click', timezonePicker.buttonClick);                    
        });
        document.querySelector('.datetime-picker-form').addEventListener('submit', function(e) {return timezonePicker.formSubmit(e);});
    }
}