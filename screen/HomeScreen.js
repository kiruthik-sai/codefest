import {
    View,
    Image,
    KeyboardAvoidingView,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Button,
    ScrollView,
    FlatList,
    Linking,
    Alert,
    Modal,
    Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../database/firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Icon, { Icons } from "../components/Icons";
import Emergency from "./emergency";
import {
    useFonts,
    AlegreyaSans_100Thin,
    AlegreyaSans_100Thin_Italic,
    AlegreyaSans_300Light,
    AlegreyaSans_300Light_Italic,
    AlegreyaSans_400Regular,
    AlegreyaSans_400Regular_Italic,
    AlegreyaSans_500Medium,
    AlegreyaSans_500Medium_Italic,
    AlegreyaSans_700Bold,
    AlegreyaSans_700Bold_Italic,
    AlegreyaSans_800ExtraBold,
    AlegreyaSans_800ExtraBold_Italic,
    AlegreyaSans_900Black,
    AlegreyaSans_900Black_Italic,
} from "@expo-google-fonts/alegreya-sans";
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async ()=>{
    return {
      shouldPlaySound: true,
      shouldShowAlert: true
    }
  }
})

function getDistance(p1,p2){

  let R =  3958.8
  let newLat1 = p1[0]*(Math.PI/180)
  let newLat2 = p2[0]*(Math.PI/180)
  let latDiff = (p1[0] - p2[0])*(Math.PI/180)
  let lonDiff = (p1[1] - p2[1])*(Math.PI/180)
  let a =  Math.sin(latDiff/2) * Math.sin(latDiff/2) + Math.cos(newLat1) * Math.cos(newLat2) * Math.sin(lonDiff/2) * Math.sin(lonDiff/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R*c
}

async function schedulePushNotification() {
  console.log("inside push notification")
  //await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got this 💓 !!!",
      body: "You've got this! Hold on to yourself!"
    },
    trigger:null
  });
  console.log("notification sent")
}



const HomeScreen = () => {
    const [saScore, setSAScore] = useState(12);
    const [saBGColor, setSABGColor] = useState("#f1ae42");
    const [allNews, setAllNews] = useState(null);
    const [newsArray, setNewsArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }
  
        Location.watchPositionAsync({},(data)=>{
          let lat = data.coords.latitude
          let lon = data.coords.longitude
          let currentPoint = [lat,lon]
          let coordinates = require('../coordinates.json');
  
              for(let i=0;i<coordinates.data.length; i++){
                  if(getDistance(currentPoint, coordinates.data[i])<=1){
                      console.log(i)
                      console.log("!!!!!!!!!!!ALERT!!!!!!!!!!!!!!!!")
                      schedulePushNotification()
                      break
                  }
              }
        })
        console.log(location)
      })();
    }, []);
    let [fontsLoaded] = useFonts({
        AlegreyaSans_100Thin,
        AlegreyaSans_100Thin_Italic,
        AlegreyaSans_300Light,
        AlegreyaSans_300Light_Italic,
        AlegreyaSans_400Regular,
        AlegreyaSans_400Regular_Italic,
        AlegreyaSans_500Medium,
        AlegreyaSans_500Medium_Italic,
        AlegreyaSans_700Bold,
        AlegreyaSans_700Bold_Italic,
        AlegreyaSans_800ExtraBold,
        AlegreyaSans_800ExtraBold_Italic,
        AlegreyaSans_900Black,
        AlegreyaSans_900Black_Italic,
    });

    useEffect(() => {
        if (saScore <= 34) {
            setSABGColor("#7ff142");
        }
        if (saScore > 34 && saScore <= 66) {
            setSABGColor("#f1ae42");
        }
        if (saScore > 66) {
            setSABGColor("#F14D42");
        }
    });

    // Get the news
    useEffect(() => {
        console.log(auth.currentUser);
        fetch("https://hygia12.herokuapp.com/news")
            .then((res) => res.json())
            .then((data) => {
                setAllNews(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (allNews) {
            let temp = [];
            for (let key in allNews) {
                //newsArray.push(allNews[key]);
                //console.log("key = ", key, "obj = ", allNews[key]);
                temp.push(allNews[key]);
                //setNewsArray([...newsArray, allNews[key]])
            }
            setNewsArray(temp);
        }
    }, [allNews]);

    const handleNewsClick = (newsURL) => {
        console.log(newsURL);
        Linking.openURL(newsURL);
    };
    const navigation = useNavigation();

    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <ScrollView style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            
                            <Emergency/>
                        </View>
                    </View>
                </Modal>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.profileMenu}>
                        <Image
                            source={require("../assets/projectLogo.png")}
                            style={styles.profileLogo}
                        />
                    </View>
                    <TouchableOpacity style={styles.profilePhoto}  onPress={() =>  setModalVisible(true)}> 
                        <Image
                            source={require("../assets/avatar.png")}
                            style={styles.profilePhoto}
                        />
                    </TouchableOpacity>
                </View>

                {/* Welcome Message */}
                {/* Update font */}
                <View style={styles.welcomeMessage}>
                    <Text style={styles.welcomeTime}>
                        Welcome back,&nbsp;
                        <Text style={styles.welcomeUser}>
                            {auth.currentUser.displayName}!
                        </Text>
                    </Text>
                </View>

                {/* How are you feeling now?*/}
                <View style={styles.feelingsNow}>
                    <Text style={styles.feelingsText}>
                        How are you feeling?
                    </Text>
                    <View style={styles.feelingsBox}>
                        <View style={styles.feelingHappyBox}>
                            <TouchableOpacity
                                style={[
                                    styles.feelingsOption,
                                    styles.feelingHappy,
                                ]}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={"happy-outline"}
                                    style={styles.feelingIcon}
                                />
                            </TouchableOpacity>
                            <Text style={styles.feelingText}> Happy </Text>
                        </View>

                        <View style={styles.feelingCalmBox}>
                            <TouchableOpacity
                                style={[
                                    styles.feelingsOption,
                                    styles.feelingCalm,
                                ]}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={"leaf-outline"}
                                    style={styles.feelingIcon}
                                ></Icon>
                            </TouchableOpacity>
                            <Text style={styles.feelingText}> Calm </Text>
                        </View>

                        <View style={styles.feelingRelaxedBox}>
                            <TouchableOpacity
                                style={[
                                    styles.feelingsOption,
                                    styles.feelingRelaxed,
                                ]}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={"rose-outline"}
                                    style={styles.feelingIcon}
                                ></Icon>
                            </TouchableOpacity>
                            <Text style={styles.feelingText}> Relaxed </Text>
                        </View>

                        <View style={styles.feelingFocusedBox}>
                            <TouchableOpacity
                                style={[
                                    styles.feelingsOption,
                                    styles.feelingFocused,
                                ]}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={"school-outline"}
                                    style={styles.feelingIcon}
                                ></Icon>
                            </TouchableOpacity>
                            <Text style={styles.feelingText}> Focused </Text>
                        </View>
                    </View>
                </View>

                {/* Month and Map */}
                <View style={styles.monthAndmap}>
                    <View style={styles.calendarBox}>
                        <View
                            style={styles.calendarMainBox}
                            backgroundColor={saBGColor}
                        >
                            <Text style={styles.substanceScore}>{saScore}</Text>
                            <Text style={styles.substanceForecast}>SORC</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Maps");
                        }}
                        style={styles.mapBox}
                    >
                        <Image
                            source={require("../assets/mapImg.jpeg")}
                            style={styles.mapImg}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.newsArticles}>
                    <ScrollView horizontal={true}>
                        {newsArray.map((news) => (
                            <TouchableOpacity
                                style={styles.newsDisplayBox}
                                onPress={() => {
                                    handleNewsClick(news.source);
                                }}
                            >
                                <Image
                                    //onPress={() => console.log(news.source)}
                                    source={{ uri: news.img }}
                                    style={styles.newsImage}
                                />
                                <Text
                                    style={styles.newsText}
                                    //onPress={() => console.log(news.source)}
                                >
                                    {news.summary}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        marginBottom: 75,
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    newsDisplayBox: {
        backgroundColor: "#e0e0e0",
        margin: 10,
        width: 350,
        borderRadius: 25,
        padding: 10,
        color: "white",
    },
    newsImage: {
        width: "100%",
        height: 200,
        borderRadius: 25,
    },
    newsText: {
        padding: 10,
        fontWeight: "600",
    },
    profileHeader: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        paddingTop: 25,
        marginTop: 20,
    },
    profileLogo: {
        width: 50,
        height: 50,
        marginLeft: 15,
        borderRadius: 50,
    },
    profilePhoto: {
        width: 50,
        height: 50,
        marginRight: 15,
        marginLeft: "auto",
        borderRadius: 50,
    },
    welcomeMessage: {
        flex: 1,
        marginTop: 14,
        justifyContent: "center",
        marginLeft: 10,
    },
    welcomeTime: {
        fontSize: 35,
        fontFamily: "AlegreyaSans_400Regular",
        marginTop: -10,
    },
    welcomeUser: {
        fontSize: 40,
        fontFamily: "AlegreyaSans_700Bold",
    },
    welcomeEmoji: {
        fontSize: 40,
    },
    feelingsNow: {
        flex: 2,
        fontFamily: "AlegreyaSans_400Regular",
    },
    feelingsText: {
        marginTop: 15,
        marginLeft: 10,
        fontSize: 25,
        fontFamily: "AlegreyaSans_400Regular",
    },
    feelingsBox: {
        flexDirection: "row",
        marginBottom: 10,
    },
    feelingsOption: {
        height: 70,
        borderRadius: 20,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    feelingIcon: {
        color: "white",
        fontSize: 50,
    },
    feelingText: {
        textAlign: "center",
        fontFamily: "AlegreyaSans_400Regular",
    },
    feelingHappyBox: {
        flex: 1,
        justifyContent: "center",
    },
    feelingHappy: {
        backgroundColor: "#EF5DA8",
    },
    feelingCalmBox: {
        flex: 1,
    },
    feelingCalm: {
        backgroundColor: "#AEAFF7",
    },
    feelingRelaxedBox: {
        flex: 1,
    },
    feelingRelaxed: {
        backgroundColor: "#F09E54",
    },
    feelingFocusedBox: {
        flex: 1,
    },
    feelingFocused: {
        backgroundColor: "#A0E3E2",
    },
    planMainBox: {
        flex: 1,
    },
    planBox: {
        backgroundColor: "#FCDDEC",
        flex: 1,
        borderRadius: 25,
        margin: 10,
    },
    monthAndmap: {
        flexDirection: "row",
        flex: 2,
    },
    calendarBox: {
        flex: 1,
    },
    calendarMainBox: {
        flex: 1,
        margin: 10,
        backgroundColor: "#FCDDEC",
        borderRadius: 25,
        justifyContent: "center",
    },
    substanceScore: {
        fontSize: 100,
        fontWeight: "bold",
        textAlign: "center",
        opacity: 0.7,
    },
    substanceForecast: {
        textAlign: "center",
        paddingBottom: 10,
    },
    mapBox: {
        flex: 1,
    },
    mapImg: {
        borderRadius: 25,
        margin: 10,
        width: "90%",
        height: "90%",
    },
    newsArticles: {
        flex: 4,
    },
});
