import { useEffect, useState } from "react";
import ImageProfile from "../../assets/logo.jpg";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { useContext } from "react";
import { DashboardContext } from "../dashboard/Dashboard";

const INIT_FORMDATA = {
  username: {
    value: "",
    type: "text",
    error: "",
    disabled: false,
  },
  email: {
    value: "",
    type: "text",
    error: "",
    disabled: true,
  },
  address: {
    value: "",
    type: "text",
    error: "",
    disabled: false,
  },
  phone: {
    value: "",
    type: "number",
    error: "",
    disabled: false,
  },
};

function ProfilePage(props) {
  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [popupProfile, setPopupProfile] = useState(false);
  const [uploadImage, setImageUpload] = useState(null);

  const { userInfo } = useContext(DashboardContext);

  console.log("userInfo", userInfo);

  const handleUploadImage = (e) => {
    let urlImg = e.target.files[0];
    console.log("first", URL.createObjectURL(urlImg));
    setImageUpload(URL.createObjectURL(urlImg));
  };

  const handleClosePopupProfile = () => {
    setPopupProfile(false);
  };
  const handleShowPopupProfile = () => {
    setPopupProfile(true);
  };

  return (
    <div className="max-w-[900px] m-auto bg-white mb-[30px] mt-[30px] ">
      <div className="text-center p-5 lg:pb-8 xl:pb-11.5 bg-white shadow-sm">
        <div className="relative z-30 mx-auto h-[11rem] w-full max-w-[11rem] rounded-full sm:p-3 bg-gray-50">
          <div className="relative drop-shadow-2 m-auto">
            <img
              className="rounded-full w-[152px] h-[152px]"
              src={uploadImage ? uploadImage : ImageProfile}
              alt="profile"
            />
            <label className="absolute bottom-0 right-0 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-black text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2">
              <svg
                className="fill-current"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                  fill=""
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                  fill=""
                ></path>
              </svg>
              <button
                id="profile"
                className="sr-only"
                onClick={handleShowPopupProfile}
              />
            </label>
          </div>
        </div>
        <div className="user-info mt-4">
          <div className="flex gap-2 items-center justify-center">
            <h3 className="text-2xl font-medium text-black">Tai Pham</h3>
            <div className="cursor-pointer" onClick={handleShowPopupProfile}>
              <Icon type="icon-edit" />
            </div>
          </div>

          <Popup
            isOpen={popupProfile}
            title="Edit Profile"
            onClose={handleClosePopupProfile}
            onSubmit={handleShowPopupProfile}
          >
            <div className="relative z-30 mx-auto h-[11rem] w-full max-w-[11rem] rounded-full sm:p-3 bg-gray-50 mb-5">
              <div className="relative drop-shadow-2 m-auto">
                <img
                  className="rounded-full w-[152px] h-[152px]"
                  src={uploadImage ? uploadImage : ImageProfile}
                  alt="profile"
                />
                <label className="absolute bottom-0 right-0 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-black text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2">
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill=""
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                      fill=""
                    ></path>
                  </svg>
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                    onChange={handleUploadImage}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(formData).map((key) => {
                const field = formData[key];
                return (
                  <div className="w-[calc(50%-4px)] text-left" key={key}>
                    <FormField
                      label={key}
                      value={field.value}
                      type={field.type}
                      error={field.error}
                      options={field.options || []}
                      onChange={() => {}}
                      className="h-[38px] text-sm"
                      disabled={field.disabled}
                    />
                  </div>
                );
              })}
            </div>
          </Popup>
        </div>
        <div className="mx-auto px-5 pt-4">
          <h4 className="font-medium text-black ">About Me</h4>
          <p className="mt-4.5 text-sm font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque posuere fermentum urna, eu condimentum mauris tempus
            ut. Donec fermentum blandit aliquet. Etiam dictum dapibus ultricies.
            Sed vel aliquet libero. Nunc a augue fermentum, pharetra ligula sed,
            aliquam lacus.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
