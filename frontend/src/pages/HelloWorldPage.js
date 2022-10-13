import axios from "axios";
import {useEffect, useState} from "react";
import {HELLO_WORLD_URL} from "../Endpoints";

export function HelloWorldPage() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios
            .get(HELLO_WORLD_URL)
            .then((res) => {
                const {greeting} = res.data;
                setMessage(greeting);
            });
    }, []);

    return (
        <span><b>Response: </b><span>{message}</span></span>
    );
}