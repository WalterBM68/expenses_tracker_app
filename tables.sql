
CREATE TABLE users(
    id serial not null primary key,
    firstname text not null,
    lastname text not null,
    email varchar(80) not null,
    code text not null
);
CREATE TABLE category(
    id serial not null primary key,
    description text not null
);
CREATE TABLE expenses(
    id serial not null primary key,
    expense_date date not null,
    amount int not null,
    user_id int,
    category_id int,
    foreign key(user_id) references users(id),
    foreign key(category_id) references category(id)
); 
