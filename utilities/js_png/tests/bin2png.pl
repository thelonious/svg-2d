#!/usr/bin/perl -w
#####
#
#   bin2png.pl
#
#####

#####
#
#   includes
#
#####
use File::Basename;


#####
#
#   main
#
#####
if ( @ARGV == 0 ) {
    print STDERR "usage: bin2png <file.bin>+\n";
} else {
    while ( @ARGV ) {
        my $file = shift @ARGV;

        process_file($file);
    }
}


#####
#
#   process_file
#
#####
sub process_file {
    my $file = shift;
    my $dest = $file . ".png";

    open INPUT, $file || die "Could not open $file: $!";
    open OUTPUT, ">$dest" || die "Could not create $dest: $!";
    while ( <INPUT> ) {
        chomp;
        s/^([0-9]+).*$/$1/g;
        print OUTPUT chr($_);
    }
    close OUTPUT;
    close INPUT;
}
