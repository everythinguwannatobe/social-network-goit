import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { View, Text } from "react-native";

import useMakePhoto from "../../../shared/hooks/useMakePhoto";
import useForm from "../../../shared/hooks/useForm";

import { authSignUp } from "../../../redux/auth/auth-operation";
import { uploadPhotoToServer } from "../../../shared/api/api-uploadImages";

import AuthAndProfileView from "../../../shared/components/AuthAndProfileView/AuthAndProfileView";
import UserPhotoView from "../../../shared/components/UserPhotoView/UserPhotoView";
import Title from "../../../shared/components/Title/Title";
import Button from "../../../shared/components/Button/Button";
import CustomTextInput from "../../../shared/components/CustomTextInput/CustomTextInput";

import { initialState } from "./initialState";
import { styles } from "./styles";

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();
  const { makePhoto, uri, setUri, chooseThePicture, markup } = useMakePhoto();
  const [response, setResponse] = useState(null);

  const onSubmit = (data) => {
    if (uri) {
      (async () => {
        const data = await uploadPhotoToServer(uri, "userPhoto");
        setResponse(data);
      })();
    }
    dispatch(authSignUp({ ...data, photo }));

    setUri("");
  };
  const { state, handleChangeTextInput, handleSubmit } = useForm({
    initialState,
    onSubmit,
  });
  const { login, email, password } = state;

  return (
    <>
      {!makePhoto && (
        <AuthAndProfileView>
          <UserPhotoView uri={uri} chooseThePicture={chooseThePicture} />
          <View
            style={{
              marginTop: 52,
              marginBottom: 16,
            }}
          >
            <Title text="Регістрація" />
          </View>
          <CustomTextInput
            placeholder="Логін"
            onChangeText={handleChangeTextInput}
            keyboardType="login"
            value={login}
          />
          <CustomTextInput
            placeholder="Адреса електронної пошти"
            onChangeText={handleChangeTextInput}
            keyboardType="email"
            pattern="/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/"
            value={email}
          />
          <CustomTextInput
            placeholder="Пароль"
            onChangeText={handleChangeTextInput}
            keyboardType="password"
            pattern="/^[a-zA-Z0-9!@#$%^&*]{6,16}$/"
            value={password}
            secureTextEntryStart={true}
            link={true}
          />
          <View
            style={{
              width: " 100%",
              alignItems: "center",
              marginTop: 43,
            }}
          >
            <Button text="Зареєструватися" func={handleSubmit} />
          </View>
          <Text
            style={styles.linkPath}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            Вже є аккаунт? Ввійти
          </Text>
        </AuthAndProfileView>
      )}
      {makePhoto && markup}
    </>
  );
}
