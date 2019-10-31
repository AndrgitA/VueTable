<template>
    <div class="action-buttons">
        <div class="btn btn-delete" @click="$emit('remove')">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="20px" height="20px" viewBox="0 0 348.333 348.334" style="enable-background:new 0 0 348.333 348.334;"
                xml:space="preserve">
            <g>
                <path d="M336.559,68.611L231.016,174.165l105.543,105.549c15.699,15.705,15.699,41.145,0,56.85
                    c-7.844,7.844-18.128,11.769-28.407,11.769c-10.296,0-20.581-3.919-28.419-11.769L174.167,231.003L68.609,336.563
                    c-7.843,7.844-18.128,11.769-28.416,11.769c-10.285,0-20.563-3.919-28.413-11.769c-15.699-15.698-15.699-41.139,0-56.85
                    l105.54-105.549L11.774,68.611c-15.699-15.699-15.699-41.145,0-56.844c15.696-15.687,41.127-15.687,56.829,0l105.563,105.554
                    L279.721,11.767c15.705-15.687,41.139-15.687,56.832,0C352.258,27.466,352.258,52.912,336.559,68.611z"/>
            </g>
            </svg>
        </div>
        <div class="btn btn-up" @click="$emit('add', -1);">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="20px" height="20px" viewBox="0 0 444.819 444.819" style="enable-background:new 0 0 444.819 444.819;"
                xml:space="preserve">
            <g>
                <path d="M352.025,196.712L165.884,10.848C159.029,3.615,150.469,0,140.187,0c-10.282,0-18.842,3.619-25.697,10.848L92.792,32.264
                    c-7.044,7.043-10.566,15.604-10.566,25.692c0,9.897,3.521,18.56,10.566,25.981l138.753,138.473L92.786,361.168
                    c-7.042,7.043-10.564,15.604-10.564,25.693c0,9.896,3.521,18.562,10.564,25.98l21.7,21.413
                    c7.043,7.043,15.612,10.564,25.697,10.564c10.089,0,18.656-3.521,25.697-10.564l186.145-185.864
                    c7.046-7.423,10.571-16.084,10.571-25.981C362.597,212.321,359.071,203.755,352.025,196.712z"/>
            </g>
            </svg>
        </div>
        <div class="btn btn-down" @click="$emit('add', 1)">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="20px" height="20px" viewBox="0 0 444.819 444.819" style="enable-background:new 0 0 444.819 444.819;"
                xml:space="preserve">
            <g>
                <path d="M352.025,196.712L165.884,10.848C159.029,3.615,150.469,0,140.187,0c-10.282,0-18.842,3.619-25.697,10.848L92.792,32.264
                    c-7.044,7.043-10.566,15.604-10.566,25.692c0,9.897,3.521,18.56,10.566,25.981l138.753,138.473L92.786,361.168
                    c-7.042,7.043-10.564,15.604-10.564,25.693c0,9.896,3.521,18.562,10.564,25.98l21.7,21.413
                    c7.043,7.043,15.612,10.564,25.697,10.564c10.089,0,18.656-3.521,25.697-10.564l186.145-185.864
                    c7.046-7.423,10.571-16.084,10.571-25.981C362.597,212.321,359.071,203.755,352.025,196.712z"/>
            </g>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: "ActionButton"
}
</script>

<style>
.action-buttons {
    width: 100%;
    height: 40px;
}
.action-buttons .btn {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
}
.action-buttons .btn-delete {
    height: 20px;
    width: 20px;
}
.action-buttons .btn-up {
    position: relative;
    transform: rotate(-90deg);
    height: 20px;
    width: 20px;
    top: -3px;
}

.btn path {
    stroke: grey;
    fill: grey;
}
.btn:hover path {
    stroke: black;
    fill: black;
}

.action-buttons .btn-down {
    position: relative;
    transform: rotate(90deg);
    height: 20px;
    width: 20px;
    top: 3px;
}
</style>