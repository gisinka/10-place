import timeout from "./timeout.mjs";
import drawer from "./drawer.mjs";
import picker from "./picker.mjs";

document.querySelector("#start").addEventListener("submit", e => {
    e.preventDefault();
    main(new FormData(e.currentTarget).get("apiKey"));
    document.querySelector(".container").classList.add("ready");
});

const main = apiKey => {
    const ws = connect(apiKey);
    ws.addEventListener("message", message => {
        let data = JSON.parse(message.data);
        if (data.type === "paint")
            drawer.putArray(data.payload);
        else if (data.type === "setPoint")
            drawer.put(data.payload.x, data.payload.y, data.payload.color)
        else if (data.type === "timeout")
            alert(`В следующий раз вы можете нарисовать в ${new Date(data.time)}`)
    });

    drawer.onClick = (x, y) => {
        ws.send(JSON.stringify({
            type: 'setPoint',
            payload: {
                x: x,
                y: y,
                color: picker.color
            }
        }))
    };
};


const connect = apiKey => {
    const url = `${location.origin.replace(/^http/, "ws")}?apiKey=${apiKey}`;
    return new WebSocket(url);
};
