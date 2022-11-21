create table Users
(
    id        int auto_increment
        primary key,
    firstName varchar(255) not null,
    gender    enum ('male', 'female') default (_utf8mb4 'male') null
);

create table Friends
(
    id       int auto_increment
        primary key,
    userId   int not null,
    friendId int not null,
    constraint Friends_pk
        unique (userId),
    constraint Friends_Users_id_fk
        foreign key (friendId) references Users (id),
    constraint Friends_Users_null_fk
        foreign key (userId) references Users (id)
);