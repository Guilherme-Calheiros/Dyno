import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
    const [message, setMessage] = useState("");

    async function fetchHello() {
        try {
            const res = await fetch("http://localhost:3000/api/hello");
            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Erro ao conectar");
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Chamar server" onPress={fetchHello} />
            {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
        </View>
    );
}
