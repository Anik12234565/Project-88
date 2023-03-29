import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TextInput,
  Alert, 
  TouchableOpacity,
  Text
} from "react-native";

import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

const appIcon = require("../assets/logo.png");

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name:"",
      last_name:"",
      email: "",
      password: "",
      confirmPassword: "",
      fontsLoaded: false,
      light_theme: true
    };
  }
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
 
  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

 registerUser = (email, password,confirmPassword,first_name,last_name) => {
  if(password==confirmPassword){
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        Alert.alert("User registered!!");
        console.log(userCredential.user.uid)
        this.props.navigation.replace("Login");
        firebase.database().ref("/users/" + userCredential.user.uid)
                .set({
                  email: userCredential.user.email,
                  first_name: first_name,
                  last_name: last_name,
                  current_theme: "dark"
                })
      })
      .catch(error => {
        Alert.alert(error.message);
      });
    }else{
      Alert.alert("Passwords don't match!");
    }
  };
  

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      const { email, password, confirmPassword, first_name, last_name } = this.state;
      
      return (
        <View style={this.state.light_theme ? styles.containerLight : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />

            <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>Register</Text>
           
            <TextInput
              style={this.state.light_theme ? styles.textinputLight : styles.textinput}
              onChangeText={text => this.setState({ first_name: text })}
              placeholder={"First name"}
              placeholderTextColor={"#FFFFFF"}
    
            />
            <TextInput
              style={this.state.light_theme ? styles.textinputLight : styles.textinput}
              onChangeText={text => this.setState({ last_name: text })}
              placeholder={"Last name"}
              placeholderTextColor={"#FFFFFF"}
        
            />
            <TextInput
              style={this.state.light_theme ? styles.textinputLight : styles.textinput}
              onChangeText={text => this.setState({ email: text })}
              placeholder={"Enter Email"}
              placeholderTextColor={"#FFFFFF"}
  
            />
            <TextInput
              style={this.state.light_theme ? styles.textinputLight : styles.textinput}
              onChangeText={text => this.setState({ password: text })}
              placeholder={"Enter Password"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />
            <TextInput
              style={this.state.light_theme ? styles.textinputLight : styles.textinput}
              onChangeText={text => this.setState({ confirmPassword: text })}
              placeholder={"Re-enter Password"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />
            <TouchableOpacity
              style={[this.state.light_theme ? styles.buttonLight : styles.button, { marginTop: 20 }]}
              onPress={() => this.registerUser(email, password, confirmPassword,first_name,last_name)}
            >
              <Text style={this.state.light_theme ? styles.buttonTextLight : styles.buttonText}>Register</Text>
            </TouchableOpacity>    
            <TouchableOpacity
              onPress={()=>this.props.navigation.replace("Login")}
            >
              <Text style={this.state.light_theme ? styles.buttonTextNewUserLight : styles.buttonTextNewUser}>Login ?</Text>
            </TouchableOpacity>         
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
    alignItems:"center",
    justifyContent:"center"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems:"center",
    justifyContent:"center"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appIcon: {
    width: RFValue(200),
    height: RFValue(200),
    resizeMode: "contain",
    marginBottom:RFValue(20)
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginBottom:RFValue(20)
  },
  appTitleTextLight: {
    color: "black",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginBottom:RFValue(20)
  },
  textinput: {
    width:  RFValue(250),
    height: RFValue(40),
    padding: RFValue(10),
    marginTop:RFValue(10),
    borderColor: "#FFFFFF",
    borderWidth: RFValue(4),
    borderRadius: RFValue(10),
    fontSize: RFValue(15),
    color: "#FFFFFF",
    backgroundColor: "#15193c",
    fontFamily: "Bubblegum-Sans"
  },
  textinputLight: {
    width:  RFValue(250),
    height: RFValue(40),
    padding: RFValue(10),
    marginTop:RFValue(10),
    borderColor: "black",
    borderWidth: RFValue(4),
    borderRadius: RFValue(10),
    fontSize: RFValue(15),
    color: "black",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bubblegum-Sans"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white",
    marginBottom:RFValue(20)
  },
  buttonLight: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "black",
    marginBottom:RFValue(20)
  },
  buttonText: {
    fontSize: RFValue(24),
    color: "#15193c",
    fontFamily: "Bubblegum-Sans"
  },
  buttonTextLight: {
    fontSize: RFValue(24),
    color: "#FFFFFF",
    fontFamily: "Bubblegum-Sans"
  },
  buttonTextNewUser: {
    fontSize: RFValue(12),
    color: "#FFFFFF",
    fontFamily: "Bubblegum-Sans",
    textDecorationLine: 'underline'
  },
  buttonTextNewUserLight: {
    fontSize: RFValue(12),
    color: "black",
    fontFamily: "Bubblegum-Sans",
    textDecorationLine: 'underline'
  }
});
