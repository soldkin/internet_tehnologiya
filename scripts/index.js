const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const confirmPopup = document.querySelector('.popup_type_confirm');
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarPopup.querySelector('.popup__input_type_avatar-url');
const profileImage = document.querySelector('.profile__image');



const profileFormElement = profilePopup.querySelector('.popup__form');
const cardFormElement = cardPopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

let pendingProfileData = {};

function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeModalByEscape);
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeModalByEscape);
}

function closeModalByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closeModal(openedPopup);
  }
}

function closeModalByOverlay(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  }
}

document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
  popup.addEventListener('mousedown', closeModalByOverlay);
});

function createCard(cardData, deleteCardCallback, likeCardCallback, openImageCallback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  
  const likeCount = cardElement.querySelector('.card__like-count');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  if (likeCount) {
    likeCount.textContent = cardData.likes || 0;
  } else {
    console.warn('Элемент счетчика лайков не найден');
  }

  deleteButton.addEventListener('click', deleteCardCallback);
  likeButton.addEventListener('click', likeCardCallback);
  cardImage.addEventListener('click', () => openImageCallback(cardData));

  return cardElement;
}

function deleteCard(evt) {
  const cardToDelete = evt.target.closest('.card');
  cardToDelete.remove();
}

function likeCard(evt) {
  const likeButton = evt.target;
  const likeContainer = likeButton.closest('.card__like-container');
  
  const likeCount = likeContainer ? likeContainer.querySelector('.card__like-count') : null;
  
  likeButton.classList.toggle('card__like-button_is-active');
  
  if (likeCount) {
    if (likeButton.classList.contains('card__like-button_is-active')) {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
    }
  }
}

function openImage(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

function loadInitialCards() {
  initialCards.forEach(cardData => {
    placesList.append(createCard(cardData, deleteCard, likeCard, openImage));
  });
}

loadInitialCards();

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  
  pendingProfileData = {
    name: nameInput.value,
    job: jobInput.value
  };
  
  openModal(confirmPopup);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  placesList.prepend(createCard(newCard, deleteCard, likeCard, openImage));
  cardFormElement.reset();
  closeModal(cardPopup);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  
  if (!avatarInput.value.startsWith('http')) {
    alert('Пожалуйста, используйте ссылку на изображение в интернете');
    return;
  }
  
  profileImage.style.backgroundImage = `url('${avatarInput.value}')`;
  closeModal(avatarPopup);
  avatarFormElement.reset();
}

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

profileAddButton.addEventListener('click', () => {
  openModal(cardPopup);
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
cardFormElement.addEventListener('submit', handleCardFormSubmit);

document.querySelectorAll('.popup__close').forEach(button => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

initialCards.forEach(cardData => {
  placesList.append(createCard(cardData, deleteCard, likeCard, openImage));
});

document.querySelector('.popup__confirm-button').addEventListener('click', () => {
  profileTitle.textContent = pendingProfileData.name;
  profileDescription.textContent = pendingProfileData.job;
  closeModal(confirmPopup);
  closeModal(profilePopup);
});

document.querySelector('.popup__cancel-button').addEventListener('click', () => {
  closeModal(confirmPopup);
});

document.querySelector('.profile__avatar-edit').addEventListener('click', () => {
  openModal(avatarPopup);
});

avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);