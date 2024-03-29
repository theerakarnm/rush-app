import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function CardEditRestaurantCategories(props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    register("description", { value: props.Data?.DESCRIPTION ?? "" })
  })

  const [checkedIds, setChekedIds] = useState(props.Data?.IS_ACTIVE ?? true);



  const handlechange = (e) => {

    if (checkedIds) {

      setChekedIds(false);
    } else {
      setChekedIds(true);
    }
  };

  const isCheked = () => {

    return checkedIds;
  };

  const onSubmit = async (data) => {
    if (data.iconName == "" || data.iconName == null || data.iconNAme == undefined) {
      data.iconName = "-"
    }

    data.isActive = checkedIds

    let JSONdata = JSON.stringify(data);

    const endpoint = `/api/restaurant_categories/upsert`;

    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSONdata,
    };

    let response
    try {

      response = await fetch(endpoint, options);
      const result = await response.json();

      history.back();
    } catch (error) {
      const MySwal = withReactContent(Swal)
      MySwal.fire({ title: "Error", text: error, icon: "error", confirmButtonText: "close" })
    }
  };
  return (
    <>
      <form
        id="restaurantForm"
        name="restaurantForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                {props.Data == null ? "เพิ่มประเภทร้านอาหาร" : "แก้ไขประเภทร้านอาหาร"}

              </h6>
              <button
                className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="submit"
              >
                บันทึก
              </button>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            {/* <form> */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              ข้อมูลประเภทร้านอาหาร
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    ชื่อประเภทร้านอาหาร <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="hidden"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={props.Data?.ID ?? 0}
                    {...register("id")}
                  />
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={props.Data?.NAME ?? ""}
                    placeholder="ชื่อหมดหมู่ร้าน"
                    {...register("name")}
                    required
                  />

                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Icon
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={props.Data?.ICON_NAME ?? ""}
                    placeholder="fa fas-icon"
                    {...register("iconName")}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    สถานะ
                  </label>
                  <input
                    type="checkbox"
                    onChange={handlechange}
                    checked={isCheked()}
                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"

                  />
                </div>
              </div>
            </div>
            <hr className="mt-6 border-b-1 border-blueGray-300" />
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              คำอธิบายเกี่ยวกับประเภทร้านอาหาร
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    คำอธิบาย
                  </label>
                  {/* <textarea
                    id="description"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    rows={4}
                    defaultValue={
                      props.Data?.DESCRIPTION ?? ""
                    }
                    {...register("description")}
                    placeholder="คำอธิบาย"
                  ></textarea> */}
                  <ReactQuill
                    className="bg-white"
                    theme="snow"
                    placeholder="คำอธิบาย"
                    value={watch("description") ?? props.Data?.DESCRIPTION} onChange={(e) => { setValue("description", e); }} />
                </div>
              </div>
            </div>
            {/* </form> */}
          </div>
        </div>
      </form>
    </>
  );
}
