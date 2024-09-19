import React from 'react';

const AddStoreOwner = ({ storeData, setStoreData }) => {
    const handleStoreDataChange = (e) => {
        const { name, value } = e.target;
        setStoreData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <p>사업자 등록번호</p>
            <input
                type="text"
                name="businessNumber"
                value={storeData.businessNumber}
                onChange={handleStoreDataChange}
                placeholder="사업자 등록번호를 입력해 주세요"
            />
            <p>대표자명</p>
            <input
                type="text"
                name="representativeName"
                value={storeData.representativeName}
                onChange={handleStoreDataChange}
                placeholder="대표자명을 입력해 주세요"
            />
            <p>매장 주소</p>
            <input
                type="text"
                name="storeAddress"
                value={storeData.storeAddress}
                onChange={handleStoreDataChange}
                placeholder="매장 주소를 입력해 주세요"
            />
            <p>업종</p>
            <input
                type="text"
                name="businessType"
                value={storeData.businessType}
                onChange={handleStoreDataChange}
                placeholder="업종을 입력해 주세요"
            />
        </div>
    );
};

export default AddStoreOwner;
