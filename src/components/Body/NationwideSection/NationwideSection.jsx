import React from 'react';
import './NationwideSection.css';

const locations = [
  { name: "압구정 청담", img: "https://image.toast.com/aaaaaqx/md/0706apgujeong.jpg" },
  { name: "부산", img: "https://image.toast.com/aaaaaqx/md/busan_.jpg" },
  { name: "잠실 송파", img: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/29098644e325436a8fc1af53f2e275c1" },
  { name: "이태원 한남", img: "https://image.toast.com/aaaaaqx/md/0706itaewon.jpg" },
  { name: "성수", img: "https://image.toast.com/aaaaaqx/md/0706sungsoo.jpg" },
  { name: "광화문 종로", img: "https://image.toast.com/aaaaaqx/md/0706gwanghwamun.jpg" },
  { name: "용산 삼각지", img: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/7feca8d9587f43bcaf54a224885209aa" },
  { name: "신사 논현", img: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/8b220d879e67458089a06887d3fcb729" },
  { name: "강남 역삼", img: "https://image.toast.com/aaaaaqx/md/0706gangnam.jpg" },
  { name: "여의도", img: "https://image.toast.com/aaaaaqx/md/0706yeouido.jpg" },
  { name: "합정 망원", img: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/3765f39b7af84d7ca79b5a4692d91148" },
  { name: "제주", img: "https://image.toast.com/aaaaaqx/md/jeju_.jpg" },
  { name: "홍대 신촌", img: "https://image.toast.com/aaaaaqx/md/0706hongdae.jpg" },
  { name: "대구", img: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/bd1d1fafb767426c93ac6d10dd0cf099" },
  { name: "북촌 삼청", img: "https://image.toast.com/aaaaaqx/md/0706bukchon_0331.jpg" },
  { name: "금호 옥수", img: "https://ugc-images.catchtable.co.kr/admin/marketing/banner/images/72fab804b63a46d5822bbf0e82e4d764" },
  { name: "명동 을지로", img: "https://image.toast.com/aaaaaqx/md/0706euljiro_0331.jpg" },
];

const NationwideSection = () => {
  return (
    <div className="nationwide-section">
      <h2>어디로 가시나요?</h2>
      <div className="section-body">
        <div className="v-scroll">
          <div className="v-scroll-inner">
            {locations.map((location, index) => (
              <button
                key={index}
                className="location-item"
                style={{ backgroundImage: `url(${location.img})` }}
                aria-label={location.name} // 접근성을 위해 aria-label 추가
              >
                <span className="label">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NationwideSection;
