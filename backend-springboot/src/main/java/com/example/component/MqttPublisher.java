package com.example.component;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MqttPublisher {


    private MqttClient mqttClient;

    @PostConstruct
    public void init() throws MqttException {
        mqttClient = new MqttClient("tcp://175.126.37.21:11883","chat_" + System.currentTimeMillis(), new MemoryPersistence());

        MqttConnectOptions options = new MqttConnectOptions();
        options.setUserName("aaa");
        options.setPassword("bbb".toCharArray());
        options.setCleanSession(true);

        mqttClient.connect(options);
    }

    public void publish(String topic, String message) throws MqttException {
        if (!mqttClient.isConnected()) {
            mqttClient.connect();
        }

        MqttMessage mqttMessage = new MqttMessage(message.getBytes());
        mqttMessage.setQos(1);
        mqttClient.publish(topic, mqttMessage);
    }
}

