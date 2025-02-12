import { useEffect, useState } from "react";
import ImageProfile from "../../assets/logo.jpg";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { useContext } from "react";
import { DashboardContext } from "../dashboard/Dashboard";
import UserApi from "../../api/userApi";
import { toast } from "react-toastify";

const INIT_FORMDATA = {
  username: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "validate.name_required";
      if (value.length < 5) return "validate.name_min_length";
    },
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
    validate: (value) => {
      if (!value.trim()) return "order_page.validate.address_is_required";
      return "";
    },
    disabled: false,
  },
  phone: {
    value: "",
    type: "number",
    error: "",
    validate: (value) => {
      const regex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

      if (!value.toString().trim())
        return "order_page.validate.phone_is_required";
      if (!regex.test(value)) {
        return "order_page.validate.phone_invalid";
      }

      return "";
    },
    disabled: false,
  },
};

function ProfilePage(props) {
  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [popupProfile, setPopupProfile] = useState(null);
  const [uploadImage, setImageUpload] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const { userInfo } = useContext(DashboardContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => {
        const updatedFormData = { ...prev };
        Object.keys(updatedFormData).forEach((key) => {
          updatedFormData[key] = {
            ...prev[key],
            value: currentUser[key],
          };
        });
        return updatedFormData;
      });
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const _userInfo = userInfo
        ? userInfo
        : JSON.parse(localStorage.getItem("userInfo"));

      if (_userInfo) {
        const res = await UserApi.findById(_userInfo.id);
        setCurrentUser(res.metadata);
      }
    } catch (error) {
      console.log("fetchProfile error", error);
      toast.error("Failed to fetch Profile");
    }
  };

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: { ...prev[name], value, error: "" },
    }));
  };

  const handleUploadImage = (e) => {
    let urlImg = e.target.files[0];
    setPreviewImage(URL.createObjectURL(urlImg));
    setImageUpload(urlImg);
  };

  const handleClosePopupProfile = () => {
    setPopupProfile(null);
  };

  const handleShowPopupProfile = () => {
    setPopupProfile(true);
  };

  const handlePopupSubmit = async () => {
    let hasError = false;
    const newFormData = { ...formData };

    Object.keys(newFormData).forEach((key) => {
      const field = newFormData[key];
      if (field.validate) {
        const error = field.validate(field.value);
        if (error) {
          hasError = true;
          newFormData[key].error = error;
        }
      }
    });

    setFormData(newFormData);
    if (hasError) return;

    const formattedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key].value;
      return acc;
    }, {});

    const formDataUploaded = new FormData();

    if (uploadImage) {
      formDataUploaded.append("avatar", uploadImage);
    }

    try {
      const res1 = await UserApi.updateWithTypeUpload(
        userInfo.id,
        formDataUploaded
      );
      const res2 = await UserApi.update({ id: userInfo.id, ...formattedData });
      toast.success("Update profile successfully");
      setPopupProfile(null);
      fetchProfile();
      return { res1, res2 };
    } catch (error) {
      console.log("handlePopupSubmit error", error);
    }
  };

  return (
    <div className="max-w-[800px] m-auto bg-white mb-[30px] mt-[30px]">
      <div className="text-center p-5 sm:pt-8 lg:pb-8 xl:pb-11.5 bg-white shadow-sm">
        <div className="relative z-30 flex justify-center items-center mx-auto h-[124px] w-full max-w-[124px] sm:max-w-[176px] sm:w-[176px] sm:h-[176px] rounded-full sm:p-3 bg-gradient-to-b from-gray-200 to-transparent backdrop-blur-md">
          <div className="relative drop-shadow-2 m-auto">
            <img
              id="avatar"
              className="rounded-full w-[112px] h-[112px] sm:w-[152px] sm:h-[152px]"
              src={currentUser?.avatar ? currentUser.avatar : ImageProfile}
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
            <h3 className="text-2xl font-medium text-black">
              {currentUser?.username}
            </h3>
            <div className="cursor-pointer" onClick={handleShowPopupProfile}>
              <Icon type="icon-edit" />
            </div>
          </div>
        </div>

        <div className="pt-6 sm:px-5">
          <div className="rounded-md border border-stroke">
            <h4 className="text-left font-semibold text-gray-800 bg-[#ffe9cf] border-b border-gray-200 py-2 px-5">
              Thông tin cá nhân
            </h4>
            <div className="py-1 px-5 text-left text-sm">
              <div className="py-2 flex items-center gap-2 border-b min-h-[44px]">
                <span className="font-semibold w-[100px]">Email:</span>
                <span className="text-gray-600">{currentUser?.email}</span>
              </div>
              <div className="py-2 flex flex-wrap items-center gap-2 border-b min-h-[44px]">
                <span className="font-semibold w-full md:w-[100px] ">
                  Địa chỉ:
                </span>
                <span className="text-gray-600 flex-1 w-full">
                  {currentUser?.address}
                </span>
                <button className="flex" onClick={handleShowPopupProfile}>
                  <Icon type="icon-edit" />
                </button>
              </div>
              <div className="py-2 flex items-center gap-2 min-h-[44px]">
                <span className="font-semibold w-[100px]">Số điện thoại:</span>
                <span className="text-gray-600 flex-1">
                  {currentUser?.phone}
                </span>
                <button className="flex" onClick={handleShowPopupProfile}>
                  <Icon type="icon-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Popup
          isOpen={popupProfile}
          title="Edit Profile"
          onClose={handleClosePopupProfile}
          onSubmit={handlePopupSubmit}
        >
          <div className="relative z-30 flex justify-center items-center mx-auto mb-4 h-[124px] w-full max-w-[124px] sm:max-w-[176px] sm:w-[176px] sm:h-[176px] rounded-full sm:p-3 bg-gradient-to-b from-gray-200 to-transparent backdrop-blur-md">
            <div className="relative drop-shadow-2 m-auto">
              <img
                id="avatar"
                className="rounded-full w-[112px] h-[112px] sm:w-[152px] sm:h-[152px]"
                src={currentUser?.avatar ? currentUser.avatar : ImageProfile}
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
                    onChange={(e) => handleFormChange(key, e.target.value)}
                    className="h-[38px] text-sm"
                    disabled={field.disabled}
                  />
                </div>
              );
            })}
          </div>
        </Popup>
      </div>
    </div>
  );
}

export default ProfilePage;
