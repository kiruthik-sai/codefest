import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Icon, { Icons } from "../components/Icons";
import HomeScreen from "./HomeScreen";
import Logs from "./Logs";
import Friends from "./Friends";
import Settings from "./Settings";
import Colors from "../constants/Colors";
import MapsAlert from "./Maps";
import ViewLogs from './ViewLogs'
import Emergency from "./emergency";
const TabArr = [
    
    {
        route: "ViewLogs",
        label: "Logs",
        type: Icons.Feather,
        icon: "file-text",
        component: ViewLogs,
    },
    {
      route: "Maps",
      label: "Maps",
      type: Icons.Feather,
      icon: "map-pin",
      component: MapsAlert,
  },
  {
    route: "Home",
    label: "Home",
    type: Icons.Feather,
    icon: "home",
    component: HomeScreen,
},
    {
        route: "Friends",
        label: "Contacts",
        type: Icons.Feather,
        icon: "users",
        component: Friends,
    },
    {
        route: "Settings",
        label: "Settings",
        type: Icons.Feather,
        icon: "settings",
        component: Settings,
    },
    
    
];

const Tab = createBottomTabNavigator();

const animate1 = {
    0: { scale: 0.5, translateY: 7 },
    0.92: { translateY: -34 },
    1: { scale: 1.2, translateY: -24 },
};
const animate2 = {
    0: { scale: 1.2, translateY: -24 },
    1: { scale: 1, translateY: 7 },
};

const circle1 = {
    0: { scale: 0 },
    0.3: { scale: 0.9 },
    0.5: { scale: 0.2 },
    0.8: { scale: 0.7 },
    1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);
    const circleRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (focused) {
            viewRef.current.animate(animate1);
            circleRef.current.animate(circle1);
            textRef.current.transitionTo({ scale: 1 });
        } else {
            viewRef.current.animate(animate2);
            circleRef.current.animate(circle2);
            textRef.current.transitionTo({ scale: 0 });
        }
    }, [focused]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={styles.container}
        >
            <Animatable.View
                ref={viewRef}
                duration={1000}
                style={styles.container}
            >
                <View style={styles.btn}>
                    <Animatable.View ref={circleRef} style={styles.circle} />
                    <Icon
                        type={item.type}
                        name={item.icon}
                        color={focused ? Colors.white : "#9172ca"}
                    />
                </View>
                <Animatable.Text ref={textRef} style={styles.text}>
                    {item.label}
                </Animatable.Text>
            </Animatable.View>
        </TouchableOpacity>
    );
};

export default function AnimTab2() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            {TabArr.map((item, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarShowLabel: false,
                            tabBarButton: (props) => (
                                <TabButton {...props} item={item} />
                            ),
                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tabBar: {
        height: 70,
        position: "absolute",
        bottom: 16,
        right: 16,
        left: 16,
        borderRadius: 16,
    },
    btn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: Colors.white,
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
    },
    circle: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7857b3",
        borderRadius: 25,
    },
    text: {
        fontSize: 10,
        textAlign: "center",
        color: "#7857b3",
    },
});
