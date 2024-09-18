import React, { useState } from 'react';

const AddStoreOwner = () => {
  const [storeData, setStoreData] = useState({
    businessNumber: '',
    representativeName: '',
    storeAddress: '',
    businessType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 점주 정보 저장 처리 로직
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="businessNumber"
        value={storeData.businessNumber}
        onChange={handleChange}
        placeholder="사업자 등록 번호"
        required
      />
      <input
        type="text"
        name="representativeName"
        value={storeData.representativeName}
        onChange={handleChange}
        placeholder="대표자명"
        required
      />
      <input
        type="text"
        name="storeAddress"
        value={storeData.storeAddress}
        onChange={handleChange}
        placeholder="사업장 주소"
        required
      />
      <input
        type="text"
        name="businessType"
        value={storeData.businessType}
        onChange={handleChange}
        placeholder="업태"
        required
      />

      <button type="submit">점주 정보 등록</button>
    </form>
  );
};

export default AddStoreOwner;
