import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import MemoListScreen from "./MemoListScreen/MemoListScreen";
import MemoFormScreen from "./MemoFormScreen/MemoFormScreen";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#F1E5D1",
          tabBarInactiveTintColor: "#F1E5D1", // 비활성화된 탭의 색상
          tabBarStyle: {
            backgroundColor: "#A87676", // 탭바의 배경 색상
          },
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: "#A87676", // 헤더의 배경 색상
          },
          headerTintColor: "#F1E5D1", // 헤더의 텍스트 색상
        }}
      >
        <Tab.Screen
          name="MemoListScreen"
          component={MemoListScreen}
          options={{
            title: "메모장",
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/MemoList_light.png")
                    : require("../images/MemoList_black.png")
                }
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MemoFormScreen"
          component={MemoFormScreen}
          initialParams={{ item: [] }} // 초기 파라미터로 빈 배열 전달
          options={{
            title: "메모작성",
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/MemoForm_light.png")
                    : require("../images/MemoForm_black.png")
                }
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
